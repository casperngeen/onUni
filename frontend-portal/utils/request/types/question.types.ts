import { QuestionInfo } from "./attempt.types";

export interface NewQuestionBody {
    testId: number,
    questionText: string,
}

export interface NewQuestionResponse {
    questionId: number,
}

export interface NewOptionBody {
    optionText: string,
    isCorrect: boolean,
}

export interface NewOptionResponse {
    optionId: number,
}

export interface GetQuestionResponse extends QuestionInfo {}