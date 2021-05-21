import { useMutation } from "react-query";
import axios from "axios";

export type SignUpReq = {
  email: string;
  password: string;
};

export type SignUpRes = {
  id: string;
  email: string;
  password: string;
};

export const useSignUp = () => {
  return useMutation<SignUpRes, Error, SignUpReq>((data) => {
    return axios.post("http://localhost:8080/api/auth/signup", data);
  });
};

export type SignInReq = {
  email: string;
  password: string;
};

export type SignInRes = {
  id: string;
  email: string;
  token: string;
};

export const useSignIn = () => {
  return useMutation<SignInRes, Error, SignInReq>((data) => {
    return axios.post<SignInReq, SignInRes>(
      "http://localhost:8080/api/auth/signin",
      data
    );
  });
};

export type ChangePasswordReq = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordRes = {};

export const useChangePassword = () => {
  return useMutation<ChangePasswordRes, Error, ChangePasswordReq>((data) => {
    return axios.post("http://localhost:8080/api/profile/changePassword", data);
  });
};
