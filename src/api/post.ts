import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { PostData } from "../entities/entities";

export type PostForm = {
  content: string;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<PostData, Error, PostForm, { rollback: () => void }>(
    (data) => axios.post<PostForm, PostData>("/post/posts/create", data),
    {
      async onMutate(newPost) {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries("posts");

        // Snapshot the previous value
        const previousPosts = queryClient.getQueryData<PostData[]>("posts");

        // Optimistically update to the new value
        if (previousPosts) {
          queryClient.setQueryData<PostData[]>("posts", [
            ...previousPosts,
            {
              id: Math.random(),
              content: newPost.content,
              creationDate: new Date(),
            },
          ]);
        }

        const rollback = () => queryClient.setQueryData("posts", previousPosts);
        return { rollback };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError(_error, _variables, context) {
        context?.rollback();
      },
      // Always refetch after error or success:
      async onSettled() {
        await queryClient.invalidateQueries("posts");
      },
    }
  );
};

export const usePosts = () =>
  useQuery<PostData[], Error, PostData[]>("posts", async () => {
    const { data } = await axios.get<PostData[]>("/post/posts");
    return data;
  });
