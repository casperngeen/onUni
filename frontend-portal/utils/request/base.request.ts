import { ApiResponse, RequestTypes } from "./types/base.types";
import RequestError from "./request.error";
import { AuthException } from "./status.code";
import { RefreshResponse } from "./types/auth.types";

export default class BaseRequest {
  private static readonly baseRoute = `http://localhost:3000`;

  protected static getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  
  protected static getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  protected static async request<T>(
    path: string,
    method: RequestTypes,
    bodyData: {},
  ): Promise<T> {
    try {
      let token = BaseRequest.getAccessToken();
      let jsonResponse: ApiResponse<T> = await fetch(`${BaseRequest.baseRoute}/${path}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: method === RequestTypes.GET ? null : JSON.stringify(bodyData),
      }).then((response) => response.json());
      
      // handle access token expiry
      if (jsonResponse.code == AuthException.EXPIRED_TOKEN) {
        const refresh = BaseRequest.getRefreshToken();
        const refreshResponse: ApiResponse<RefreshResponse> = await fetch(`${this.baseRoute}/auth/refresh`, {
          method: RequestTypes.POST,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${refresh}`,
          },
        }).then((response) => response.json());

        // if the refresh was successful -> set cookies and fetch original request again
        if (refreshResponse.code === 0) {
          const { accessToken, refreshToken } = refreshResponse.data;
          localStorage.set('accessToken', accessToken);
          localStorage.set('refreshToken', refreshToken);
          jsonResponse = await fetch(`${this.baseRoute}/${path}`, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(bodyData),
          }).then((response) => response.json());
        } else {
          throw new RequestError(refreshResponse.code, refreshResponse.message);
        }
      }
      
      if (jsonResponse.code != 0) {
        console.log(jsonResponse);
        throw new RequestError(jsonResponse.code, jsonResponse.message);
      }
      console.log(jsonResponse);
      return jsonResponse.data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
}
