import { useMutation } from "react-query";
import axios, { AxiosResponse } from "axios";

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

export type SignInRes = {
  id: string;
  email: string;
  token: string;
};

export const useSignIn = () => {
  return useMutation<SignInRes, Error, SignInReq>(async (data) => {
    const { data: signInRes } = await axios.post<
      SignInReq,
      AxiosResponse<SignInRes>
    >("/user/auth/login", data);
    console.log(signInRes);
    return signInRes;
  });
};

export type ChangePasswordReq = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordRes = {};

export const useChangePassword = () => {
  return useMutation<ChangePasswordRes, Error, ChangePasswordReq>(
    async (data) => {
      const { data: changePasswordRes } = await axios.post(
        "/user/profile/changePassword",
        data
      );
      return changePasswordRes;
    }
  );
};
