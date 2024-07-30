import { ApiResponse, RequestTypes } from "./types/base.types";
import RequestError from "./request.error";

export default class BaseRequest {
  private static readonly baseRoute = process.env.NEXT_PUBLIC_API_ROUTE;

  protected static getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  protected static async request<T>(
    path: string,
    method: RequestTypes,
    bodyData: {},
  ): Promise<T> {
    try {
      let token = BaseRequest.getAccessToken();
      let jsonResponse: ApiResponse<T> = await fetch(
        `${BaseRequest.baseRoute}/${path}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: method === RequestTypes.GET ? null : JSON.stringify(bodyData),
        },
      ).then((response) => response.json());

      console.log(jsonResponse);

      if (jsonResponse.code != 0) {
        throw new RequestError(jsonResponse.code, jsonResponse.message);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
