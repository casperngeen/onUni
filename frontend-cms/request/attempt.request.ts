import { AttemptResponse, NewAttemptResponse } from "../types/attempt.types";
import { RequestTypes } from "../types/base.types";
import BaseRequest from "./base.request";

export class AttemptRequest extends BaseRequest {
    public async createNewAttempt(courseId: number, testId: number) {
        return await this.request<NewAttemptResponse>(
            `attempt?courseId=${courseId}`,
            RequestTypes.POST,
            { testId: testId },
        )
    }

    public async getAllAttemptsOfUserForTest(courseId: number, testId: number) {
        return await this.request<AttemptResponse[]>(
            `test/${testId}/attempts?courseId=${courseId}`,
            RequestTypes.GET,
            {},
        )
    }

    public async getAttempt(attemptId: number) {
        return await this.request<AttemptResponse>(
            `attempt/${attemptId}`,
            RequestTypes.GET,
            {},
        )
    }

    public async deleteAttempt(attemptId: number) {
        await this.request(
            `attempt/${attemptId}`,
            RequestTypes.DELETE,
            {},
        )
    }
}