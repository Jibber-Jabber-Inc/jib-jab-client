import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { PostData } from "./useFetchPosts";

export type PostForm = {
  content: string;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation<PostData, Error, PostForm>(
    (data) => axios.post<PostForm, PostData>("/post/posts/create", data),
    {
      onMutate: async (newPost) => {
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

        return { previousPosts };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (error, variables, context: any) => {
        if (context?.previousPosts) {
          queryClient.setQueryData<PostData>("todos", context.previousPosts);
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );
};
