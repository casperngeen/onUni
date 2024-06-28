import { ChangePasswordBody, ForgetPasswordBody, ForgetPasswordResponse, LoginBody, LoginResponse, RefreshResponse, SignUpBody } from "./types/auth.types";
import { ApiResponse, RequestTypes } from "./types/base.types";
import BaseRequest from "./base.request";

export default class AuthRequest extends BaseRequest {

    public async login(body: LoginBody ) {
        const response = await BaseRequest.request<LoginResponse>('auth/login', RequestTypes.POST, body);
        const { accessToken, refreshToken } = response;
        BaseRequest.cookie.set('accessToken', accessToken);
        BaseRequest.cookie.set('refreshToken', refreshToken);
        return response.profilePic;
    }

    public async signUp(body: SignUpBody) {
        await BaseRequest.request('auth/signup', RequestTypes.POST, body);
    }

    public async forget(body: ForgetPasswordBody ) {
        const response = await BaseRequest.request<ForgetPasswordResponse>('auth/forget', RequestTypes.POST, body);
        return response.url;
    }

    public async changePassword(body: ChangePasswordBody, token: number) {
        await BaseRequest.request(`auth/changePassword/${token}`, RequestTypes.PUT, body);
    }

    public async logout() {
        await BaseRequest.request(`auth/refresh}`, RequestTypes.PUT, {});
        BaseRequest.cookie.delete('accessToken');
        BaseRequest.cookie.delete('refreshToken');
    }
    
}

const auth = new AuthRequest();
auth.login({email: "test@yahoo.com", password: "Helloworld!"})