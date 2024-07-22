import { ApiResponse, RequestTypes } from "./types/base.types";
import RequestError from "./request.error";
import { AuthException, UserException } from "./status.code";
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

      console.log(jsonResponse);
      
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

        console.log(refreshResponse);

        // if the refresh was successful -> set cookies and fetch original request again
        if (refreshResponse.code === 0) {
          const { accessToken, refreshToken } = refreshResponse.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          jsonResponse = await fetch(`${this.baseRoute}/${path}`, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: method === RequestTypes.GET ? null : JSON.stringify(bodyData),
          }).then((response) => response.json());
          console.log(jsonResponse);
        } else if (refreshResponse.code === AuthException.EXPIRED_TOKEN || refreshResponse.code === UserException.UNAUTHORISED_USER) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
        } else {
          throw new RequestError(refreshResponse.code, refreshResponse.message);
        }
      }

      if (jsonResponse.code === AuthException.EXPIRED_TOKEN || jsonResponse.code === UserException.UNAUTHORISED_USER) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
      } else if (jsonResponse.code != 0) {
        throw new RequestError(jsonResponse.code, jsonResponse.message);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
}
