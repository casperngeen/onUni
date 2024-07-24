export enum RequestTypes {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}
