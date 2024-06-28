enum ScoringFormats {
    AVERAGE = 'average',
    HIGHEST = 'highest',
    LATEST = 'latest',
}
  
enum TestTypes {
    PRACTICE = 'practice',
    EXAM = 'exam',
    QUIZ = 'quiz',
}
  

export interface TestResponse {
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

export interface NewTestBody {
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