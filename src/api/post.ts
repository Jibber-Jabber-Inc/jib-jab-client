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
  return useMutation<PostCreationRes, Error, PostForm>(
    (data) => axios.post("/post/posts/create", data),
    {
      async onSuccess() {
        await queryClient.invalidateQueries("posts");
      },
    }
  );
};

export const usePosts = () =>
  useQuery<PostData[], Error>("posts", async () => {
    const { data } = await axios.get<PostData[]>("/post/posts");
    return data;
  });

export const usePostsByUserId = (id: string) =>
  useQuery<PostData[], Error>(["posts", id], async () => {
    const { data } = await axios.get<PostData[]>(`/post/posts/user/${id}`);
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
