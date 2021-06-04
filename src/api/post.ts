import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { PostData, User } from "../entities/entities";
import { useLoggedUser } from "./auth";

export type PostForm = {
  content: string;
};

export type PostCreationRes = {
  id: string;
  content: string;
  creationDate: string;
  userInfoDto: User;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { data } = useLoggedUser();
  const user = data!;
  return useMutation<
    PostCreationRes,
    Error,
    PostForm,
    { rollback: () => void }
  >((data) => axios.post("/post/posts/create", data), {
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
            id: Math.random().toString(),
            content: newPost.content,
            creationDate: new Date().toString(),
            userInfoDto: user,
            isLiked: false,
            amountLikes: 0,
          },
        ]);
      }

      if (!previousPosts) queryClient.setQueryData("posts", []);

      const rollback = () => queryClient.setQueryData("posts", previousPosts);
      return { rollback };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError(_error, _variables, context) {
      // context?.rollback();
    },
    // Always refetch after error or success:
    async onSettled() {
      await queryClient.invalidateQueries("posts");
    },
  });
};

export const usePosts = () =>
  useQuery<PostData[], Error>("posts", async () => {
    const { data } = await axios.get<PostData[]>("/post/posts");
    return data;
  });

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => axios.post(`/post/posts/like/${id}`),
    {
      async onSuccess() {
        await queryClient.invalidateQueries("posts");
      },
    }
  );
};

export const useDislikePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => axios.post(`/post/posts/dislike/${id}`),
    {
      async onSuccess() {
        await queryClient.invalidateQueries("posts");
      },
    }
  );
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: string) => axios.post(`/post/posts/${id}`), {
    async onSuccess() {
      await queryClient.invalidateQueries("posts");
    },
  });
};
