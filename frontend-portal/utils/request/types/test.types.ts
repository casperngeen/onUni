import { GetQuestionResponse } from "./question.types"

enum ScoringFormats {
    AVERAGE = 'average',
    HIGHEST = 'highest',
    LATEST = 'latest',
}
  
export enum TestTypes {
    PRACTICE = 'practice',
    EXAM = 'exam',
    QUIZ = 'quiz',
}
  

export interface ITestResponse {
    testId: number,
    title: string,
    description: string,
    testType: TestTypes,
    maxScore: number
    deadline: string | null,
    scoringFormat: ScoringFormats | null,
    maxAttempt: number | null,
    timeLimit: number | null,
}

export interface ITestInfoForAttemptResponse {
    testTitle: string,
    courseTitle: string,
    timeLimit: number | null,
    questions: GetQuestionResponse[];
    testType: TestTypes;
}

export interface INewTest {
    courseId: number,
    title: string,
    description: string,
    testType: TestTypes,
    maxScore: number
    deadline?: string | null,
    scoringFormat?: ScoringFormats | null,
    maxAttempt?: number | null,
    timeLimit?: number | null,
}

export interface IGetTest {
    courseId: number,
    testId: number,
}

export interface IDeleteTest extends IGetTest {}

export interface IUpdateTest extends INewTest {
    testId: number,
}