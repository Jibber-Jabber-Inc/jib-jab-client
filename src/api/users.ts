import { useMutation, useQuery, useQueryClient } from "react-query";
import { User } from "../entities";
import axios from "axios";

export const useUsers = () =>
  useQuery<User[], Error>("users", async () => {
    const { data } = await axios.get<User[]>("/user/users");
    return data;
  });

export const useUserInfoById = (id: string) =>
  useQuery<User, Error>(["users", id], async () => {
    const { data } = await axios.get<User>(`/user/users/info/${id}`);
    return data;
  });

export const useFollowedUsers = () =>
  useQuery<{ userInfoDto: User[] }, Error>("followedUsers", async () => {
    const { data } = await axios.get(`/user/users/followedUsers`);
    return data;
  });

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      return axios.post(`/user/users/follow/${id}`);
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries("followedUsers");
      },
    }
  );
};
