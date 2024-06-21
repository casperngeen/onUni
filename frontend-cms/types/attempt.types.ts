export interface NewAttemptResponse {
    attemptId: number,
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