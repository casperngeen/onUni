import { RequestTypes } from "./types/base.types";
import { GetQuestionResponse, NewOptionBody, NewOptionResponse, NewQuestionBody, NewQuestionResponse } from "./types/question.types";
import BaseRequest from "./base.request";

export default class QuestionRequest extends BaseRequest {
    public static async createNewQuestion(newQuestion: NewQuestionBody, courseId: number) {
        return await BaseRequest.request<NewQuestionResponse>(
            `question?courseId=${courseId}`, 
            RequestTypes.POST, 
            newQuestion,
        )
    }

    public static async createNewOptions(courseId: number, questionId: number, options: NewOptionBody[]) {
        // get all option ids in order
        return await BaseRequest.request<NewOptionResponse[]>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.POST, 
            { optionInfo: options }
        )
    }

    public static async getAllQuestions(courseId: number, testId: number) {
        return await BaseRequest.request<GetQuestionResponse[]>(
            `test/${testId}?courseId=${courseId}`, 
            RequestTypes.GET, 
            {}
        )
    }

    public static async getQuestion(questionId: number, courseId: number) {
        return await BaseRequest.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.GET, 
            {}
        )    
    }

    public static async updateQuestion(questionId: number, courseId: number, questionText: string) {
        await BaseRequest.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.PUT, 
            { questionText: questionText }
        )    
    }

    public static async updateOption(optionId: number, courseId: number, optionText: string) {
        await BaseRequest.request<GetQuestionResponse>(
            `option/${optionId}?courseId=${courseId}`, 
            RequestTypes.PUT, 
            { optionText: optionText }
        )    
    }

    public static async deleteQuestion(questionId: number, courseId: number) {
        await BaseRequest.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.DELETE, 
            {}
        )    
    }

    public static async deleteOption(optionId: number, courseId: number) {
        await BaseRequest.request<GetQuestionResponse>(
            `option/${optionId}?courseId=${courseId}`, 
            RequestTypes.DELETE, 
            {}
        )    
    }
}