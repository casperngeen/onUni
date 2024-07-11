import { AttemptHistoryResponse } from "./attempt.types"

export enum ScoringFormats {
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
    testTitle: string,
    testDescription: string,
    testType: TestTypes,
    maxScore: number,
    start: string | null,
    deadline: string | null,
    scoringFormat: ScoringFormats | null,
    maxAttempt: number | null,
    timeLimit: number | null,
}

export interface ISingleTestResponse extends ITestResponse {
    attempts: AttemptHistoryResponse[],
    courseTitle: string,
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

export interface IGetAllTests {
    courseId: number,
}

export interface IDeleteTest {
    courseId: number,
    testId: number,
}

export interface IGetTest extends IDeleteTest {}

export interface IUpdateTest extends INewTest {
    testId: number,
}