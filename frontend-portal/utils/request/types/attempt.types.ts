export interface NewAttemptResponse {
    attemptId: number,
    questions: QuestionInfo[],
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
  }

export interface AttemptResponse {
    attemptId: number,
    status: Status,
    start: string,
    end: string,
    submitted: string | null,
    score: number | null,
    questionAttempts: QuestionAttemptResponse[];
}

export interface QuestionAttemptResponse {
    questionId: number,
    selectedOptionId: number,
    answerStatus: AnswerStatus,

}

export interface ISaveAttemptBody {
    questionAttempts: ISaveQuestionAttemptBody[]
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

export interface ISaveAttempt extends IGetAttempt {
    body: ISaveAttemptBody,
}

export interface ISaveQuestionAttempt extends IGetAttempt {
    body: ISaveQuestionAttemptBody,
}