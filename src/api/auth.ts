import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosResponse } from "axios";
import { User } from "../entities";

export type SignUpReq = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SignUpRes = {
  id: string;
  email: string;
  password: string;
};

export const useSignUp = () => {
  return useMutation<SignUpRes, Error, SignUpReq>(async (data) => {
    const { data: signUpRes } = await axios.post<
      SignUpReq,
      AxiosResponse<SignUpRes>
    >("/user/auth/register", data);
    return signUpRes;
  });
};

export type SignInReq = {
  username: string;
  password: string;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, SignInReq>(
    async (data) => {
      const { data: signInRes } = await axios.post<
        SignInReq,
        AxiosResponse<User>
      >("/user/auth/login", data);
      return signInRes;
    },
    {
      async onSuccess(user) {
        queryClient.setQueryData("loggedUser", user);
      },
    }
  );
};

export type ChangePasswordReq = {
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordRes = {};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation<ChangePasswordRes, Error, ChangePasswordReq>(
    async (data) => {
      const { data: changePasswordRes } = await axios.put(
        "/user/users/editPassword",
        data
      );
      return changePasswordRes;
    },
    {
      async onSettled() {
        await queryClient.invalidateQueries("loggedUser");
      },
    }
  );
};

export type EditProfileReq = {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type EditProfileRes = User;

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<EditProfileRes, Error, EditProfileReq>(
    async (req) => {
      const { data } = await axios.put("/user/users/editProfile", req);
      return data;
    },
    {
      async onSettled() {
        await queryClient.invalidateQueries("loggedUser");
      },
    }
  );
};

export const useLoggedUser = () => {
  return useQuery<User, Error, User>(
    "loggedUser",
    async () => {
      const { data } = await axios.get<User>("/user/users/loggedUser");
      return data;
    },
    {
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      staleTime: Infinity,
    }
  );
};

export const useLogOut = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      return axios.post("/user/auth/logout");
    },
    {
      async onSettled() {
        queryClient.setQueryData("loggedUser", null);
      },
    }
  );
};
