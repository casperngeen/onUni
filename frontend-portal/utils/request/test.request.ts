import { RequestTypes } from "./types/base.types";
import { NewTestBody, TestResponse } from "./types/test.types";
import BaseRequest from "./base.request";

export default class TestRequest extends BaseRequest {
    public async getAllTests(courseId: number) {
        return await BaseRequest.request<TestResponse[]>(`course/${courseId}/tests`, RequestTypes.GET, {});
    }

    public async getTest(testId: number, courseId: number) {
        return await BaseRequest.request<TestResponse[]>(`test/${testId}?courseId=${courseId}`, RequestTypes.GET, {});
    }
    
    public async createNewTest(newTest: NewTestBody) {
        const courseId = newTest.courseId;
        return await BaseRequest.request<TestResponse[]>(`test?courseId=${courseId}`, RequestTypes.POST, newTest);
    }

    public async updateTest(testId: number, testDetails: NewTestBody) {
        const courseId = testDetails.courseId;
        return await BaseRequest.request(`test/${testId}?courseId=${courseId}`, RequestTypes.PUT, testDetails);
    }

    public async deleteTest(testId: number, courseId: number) {
        return await BaseRequest.request(`test/${testId}?courseId=${courseId}`, RequestTypes.DELETE, {});
    }
}