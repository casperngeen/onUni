import { ChangePasswordBody, ForgetPasswordBody, ForgetPasswordResponse, LoginBody, LoginResponse, RefreshResponse, SignUpBody } from "../types/auth.types";
import { ApiResponse, RequestTypes } from "../types/base.types";
import BaseRequest from "./base.request";

export default class AuthRequest extends BaseRequest {

    public async login(body: LoginBody ) {
        const response = await this.request<LoginResponse>('auth/login', RequestTypes.POST, body);
        const { accessToken, refreshToken } = response;
        this.cookie.set('accessToken', accessToken);
        this.cookie.set('refreshToken', refreshToken);
        return response.profilePic;
    }

    public async signUp(body: SignUpBody) {
        await this.request('auth/signup', RequestTypes.POST, body);
    }

    public async forget(body: ForgetPasswordBody ) {
        const response = await this.request<ForgetPasswordResponse>('auth/forget', RequestTypes.POST, body);
        return response.url;
    }

    public async changePassword(body: ChangePasswordBody, token: number) {
        await this.request(`auth/changePassword/${token}`, RequestTypes.PUT, body);
    }

    public async logout() {
        await this.request(`auth/refresh}`, RequestTypes.PUT, {});
        this.cookie.delete('accessToken');
        this.cookie.delete('refreshToken');
    }
    
}

const auth = new AuthRequest();
auth.login({email: "test@yahoo.com", password: "Helloworld!"})