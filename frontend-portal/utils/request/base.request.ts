import { json } from "stream/consumers";
import { ApiResponse, RequestTypes } from "./types/base.types";
import RequestError from "./request.error";
import { AuthException } from "./status.code";
import { RefreshResponse } from "./types/auth.types";

export default class BaseRequest {
  private static readonly baseRoute = `http://localhost:3000`;

  protected static getAccessToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzIwMDAyOTIxLCJleHAiOjE3MjAwMzg5MjF9.Vi3g-mvz3iOLVj1g8K1iVQlqcirBOCBH3JUNBvPiGpc';
  }
  
  protected static async request<T>(
    path: string,
    method: RequestTypes,
    bodyData: {},
  ): Promise<T> {
    try {
      let token = BaseRequest.getAccessToken();
      token = token === undefined ? "" : token;
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
        const refresh = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzE5ODgyOTYzLCJleHAiOjE3MjA0ODc3NjN9.2gZK9zvmE7Vx4fgqNzbt8d3UkqYEHGSSkP5pR_mediQ';
        const refreshResponse: ApiResponse<RefreshResponse> = await fetch(`${this.baseRoute}/auth/refresh`, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${refresh}`,
          },
          body: JSON.stringify(bodyData),
        }).then((response) => response.json());

        // if the refresh was successful -> set cookies and fetch original request again
        if (refreshResponse.code === 0) {
          const { accessToken, refreshToken } = refreshResponse.data;
          // this.cookie.set('accessToken', accessToken);
          // this.cookie.set('refreshToken', refreshToken);
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
