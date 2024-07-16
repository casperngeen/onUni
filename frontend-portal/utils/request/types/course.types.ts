import { ITestResponseWithAttemptInfo, TestTypes } from "./test.types";

export interface NewCourseBody {
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export interface NewUserBody {
    userId: number,
}

interface CourseResponse {
    courseId: number, 
    title: string,
    startDate: string,
    endDate: string,
}

export interface INextTest {
    courseId: number,
    testId: number,
    testType: TestTypes,
    testTitle: string,
    courseTitle: string,
}

export interface AllCourseResponse extends CourseResponse {
    progress: number,
}

export interface AllCourseResponseObject {
    courses: AllCourseResponse[],
    nextTest: INextTest | null,
}

export interface SingleCourseResponse extends CourseResponse {
    description: string,
    tests: ITestResponseWithAttemptInfo[],
}

export interface NewCourseResponse {
    courseId: number, 
}

export interface IGetCourse {
    courseId: number,
}