import { TestTypes } from "./test.types";

export interface NewAttemptResponse {
    attemptId: number,
    questions: QuestionInfo[],
    testTitle: string,
    courseTitle: string,
    timeLimit: number | null,
    testType: TestTypes,
}

export interface QuestionInfo {
    questionId: number,
    questionText: string,
    options: OptionInfo[],
}

export interface OptionInfo {
    optionId: number,
    optionText: string,
}

export enum Status {
    SUBMIT = 'submitted',
    AUTOSUBMIT = 'auto-submitted',
    PROGRESS = 'in-progress',
    CALCULATING = 'calculating',
}

export enum AnswerStatus {
    CORRECT = 'correct',
    INCORRECT = 'incorrect',
    UNATTEMPTED = 'unattempted',
}

export interface AttemptResponse {
    attemptId: number,
    status: Status,
    start: string,
    end: string | null,
    submitted: string | null,
    score: number | null,
    questionAttempts: QuestionAttemptResponse[],
    questions: QuestionInfo[],
    courseTitle: string,
    testTitle: string,
    testType: TestTypes,
}

export interface QuestionAttemptResponse {
    questionId: number,
    selectedOptionId: number,
    answerStatus: AnswerStatus,
}

export interface ISaveQuestionAttemptBody {
    questionId: number,
    selectedOptionId: number,
}

export interface INewAttempt {
    testId: number,
    courseId: number,
}

export interface IAllAttempts extends INewAttempt {}

export interface IGetAttempt {
    attemptId: number,
}

export interface IDeleteAttempt extends IGetAttempt {}

export interface ISaveAttempt extends IGetAttempt {}

export interface ISaveQuestionAttempt extends IGetAttempt {
    body: ISaveQuestionAttemptBody,
}