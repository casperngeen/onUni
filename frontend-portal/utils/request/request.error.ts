export default class RequestError extends Error {
  private readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  public getErrorCode() {
    return this.code;
  }
}
