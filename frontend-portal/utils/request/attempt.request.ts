import {
  AttemptResponse,
  IAllAttempts,
  IDeleteAttempt,
  IGetAttempt,
  INewAttempt,
  IQuestionAttemptInfo,
  ISaveAttempt,
  ISaveQuestionAttempt,
  ITestInfoForAttemptResponse,
  NewAttemptResponse,
} from "./types/attempt.types";
import { RequestTypes } from "./types/base.types";
import BaseRequest from "./base.request";

export class AttemptRequest extends BaseRequest {
  public static async createNewAttempt(params: INewAttempt) {
    const { courseId, testId } = params;
    return await BaseRequest.request<NewAttemptResponse>(
      `attempt?courseId=${courseId}`,
      RequestTypes.POST,
      { testId: testId },
    );
  }

  public static async getAllAttemptsOfUserForTest(params: IAllAttempts) {
    const { testId, courseId } = params;
    return await BaseRequest.request<AttemptResponse[]>(
      `test/${testId}/attempts?courseId=${courseId}`,
      RequestTypes.GET,
      {},
    );
  }

  public static async getAttempt(params: IGetAttempt) {
    const { attemptId } = params;
    return await BaseRequest.request<AttemptResponse>(
      `attempt/${attemptId}`,
      RequestTypes.GET,
      {},
    );
  }

  public static async getQuestionAttempts(params: IGetAttempt) {
    const { attemptId } = params;
    return await BaseRequest.request<IQuestionAttemptInfo[]>(
      `attempt/${attemptId}/answers`,
      RequestTypes.GET,
      {},
    );
  }

  public static async deleteAttempt(params: IDeleteAttempt) {
    const { attemptId } = params;
    await BaseRequest.request(`attempt/${attemptId}`, RequestTypes.DELETE, {});
  }

  public static async saveAttempt(params: ISaveAttempt) {
    const { attemptId } = params;
    await BaseRequest.request(`attempt/${attemptId}`, RequestTypes.PUT, {});
  }

  public static async saveQuestionAttempt(params: ISaveQuestionAttempt) {
    const { attemptId, body } = params;
    await BaseRequest.request(
      `attempt/${attemptId}/question`,
      RequestTypes.PUT,
      body,
    );
  }
}
