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

export interface IDeleteTest {
    courseId: number,
    testId: number,
}

export interface IGetTest extends IDeleteTest {}

export interface IUpdateTest extends INewTest {
    testId: number,
}