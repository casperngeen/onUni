import { RequestTypes } from "./types/base.types";
import {
  IDeleteTest,
  IGetAllTests,
  IGetTest,
  INewTest,
  ISingleTestResponse,
  IAllTestResponse,
  IUpdateTest,
  ITestResponse,
} from "./types/test.types";
import BaseRequest from "./base.request";

export default class TestRequest extends BaseRequest {
  public static async getAllTests(params: IGetAllTests) {
    const { courseId } = params;
    return await BaseRequest.request<IAllTestResponse[]>(
      `course/${courseId}/tests`,
      RequestTypes.GET,
      {},
    );
  }

  public static async getTest(params: IGetTest) {
    const { testId, courseId } = params;
    return await BaseRequest.request<ISingleTestResponse>(
      `test/${testId}?courseId=${courseId}`,
      RequestTypes.GET,
      {},
    );
  }

  public static async createNewTest(params: INewTest) {
    const { courseId } = params;
    return await BaseRequest.request<ITestResponse>(
      `test?courseId=${courseId}`,
      RequestTypes.POST,
      params,
    );
  }

  public static async updateTest(params: IUpdateTest) {
    const { testId, courseId, ...testDetails } = params;
    return await BaseRequest.request(
      `test/${testId}?courseId=${courseId}`,
      RequestTypes.PUT,
      { testId: testId, ...testDetails },
    );
  }

  public static async deleteTest(params: IDeleteTest) {
    const { testId, courseId } = params;
    return await BaseRequest.request(
      `test/${testId}?courseId=${courseId}`,
      RequestTypes.DELETE,
      {},
    );
  }
}
