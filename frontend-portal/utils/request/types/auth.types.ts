import { ApiResponse } from "./base.types";

export interface LoginBody {
  email: string;
  password: string;
}

export enum Roles {
  STUDENT = "student",
  TEACHER = "teacher",
}

export interface ValidateTokenBody {
  token: string;
}

export interface SignUpBody {
  email: string;
  password: string;
  role: Roles;
}

export interface ForgetPasswordBody {
  email: string;
}

export interface ChangePasswordBody {
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profilePic: string | null;
  name: string;
}

export interface ForgetPasswordResponse {
  url: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
