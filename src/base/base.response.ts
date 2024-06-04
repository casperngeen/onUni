import { OK } from './status.code';

export class ResponseHandler {
  static success(data?: object) {
    return this.response(true, OK, data);
  }

  static fail(code: number, message: string, data?: object) {
    return this.response(false, code, data, message);
  }

  static response(
    success: boolean,
    code: number,
    data?: object,
    message?: string,
  ): { status: string; code: number; message: string; data: object } {
    return {
      status: success ? 'success' : 'failure',
      code: code,
      message: message ? message : 'Request was successful',
      data: data,
    };
  }
}
