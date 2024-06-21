import { RequestTypes } from "../types/base.types";
import { GetQuestionResponse, NewOptionBody, NewOptionResponse, NewQuestionBody, NewQuestionResponse } from "../types/question.types";
import BaseRequest from "./base.request";

export default class QuestionRequest extends BaseRequest {
    public async createNewQuestion(newQuestion: NewQuestionBody, courseId: number) {
        return await this.request<NewQuestionResponse>(
            `question?courseId=${courseId}`, 
            RequestTypes.POST, 
            newQuestion,
        )
    }

    public async createNewOptions(courseId: number, questionId: number, options: NewOptionBody[]) {
        // get all option ids in order
        return await this.request<NewOptionResponse[]>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.POST, 
            { optionInfo: options }
        )
    }

    public async getAllQuestions(courseId: number, testId: number) {
        return await this.request<NewOptionResponse[]>(
            `test/${testId}?courseId=${courseId}`, 
            RequestTypes.GET, 
            {}
        )
    }

    public async getQuestion(questionId: number, courseId: number) {
        return await this.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.GET, 
            {}
        )    
    }

    public async updateQuestion(questionId: number, courseId: number, questionText: string) {
        await this.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.PUT, 
            { questionText: questionText }
        )    
    }

    public async updateOption(optionId: number, courseId: number, optionText: string) {
        await this.request<GetQuestionResponse>(
            `option/${optionId}?courseId=${courseId}`, 
            RequestTypes.PUT, 
            { optionText: optionText }
        )    
    }

    public async deleteQuestion(questionId: number, courseId: number) {
        await this.request<GetQuestionResponse>(
            `question/${questionId}?courseId=${courseId}`, 
            RequestTypes.DELETE, 
            {}
        )    
    }

    public async deleteOption(optionId: number, courseId: number) {
        await this.request<GetQuestionResponse>(
            `option/${optionId}?courseId=${courseId}`, 
            RequestTypes.DELETE, 
            {}
        )    
    }
}