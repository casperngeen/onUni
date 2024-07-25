import {
  ChangePasswordBody,
  ForgetPasswordBody,
  ForgetPasswordResponse,
  LoginBody,
  LoginResponse,
  RefreshResponse,
  SignUpBody,
  ValidateTokenBody,
} from "./types/auth.types";
import { ApiResponse, RequestTypes } from "./types/base.types";
import BaseRequest from "./base.request";

export default class AuthRequest extends BaseRequest {
  public static async login(body: LoginBody, dispatch: any) {
    const response = await BaseRequest.request<LoginResponse>(
      "auth/login",
      RequestTypes.POST,
      body,
    );
    const { accessToken, refreshToken, name, profilePic } = response;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", name);
    return { refreshToken: refreshToken, accessToken: accessToken };
  }

  public static async signUp(body: SignUpBody) {
    await BaseRequest.request("auth/signup", RequestTypes.POST, body);
  }

  public static async validateToken(body: ValidateTokenBody) {
    await BaseRequest.request("auth/validate", RequestTypes.POST, body);
  }

  public static async forget(body: ForgetPasswordBody) {
    const response = await BaseRequest.request<ForgetPasswordResponse>(
      "auth/forget",
      RequestTypes.POST,
      body,
    );
    return response.url;
  }

  public static async changePassword(body: ChangePasswordBody, token: number) {
    await BaseRequest.request(
      `auth/changePassword/${token}`,
      RequestTypes.PUT,
      body,
    );
  }

  public static async logout(dispatch: any) {
    await BaseRequest.request(`auth/logout`, RequestTypes.POST, {});
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(`username`);
  }
}
