import { ITestResponseWithAttemptInfo } from "./test.types";

export interface NewCourseBody {
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export interface NewUserBody {
    userId: number,
}

export interface CourseResponse {
    courseId: number, 
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export interface SingleCourseResponse extends CourseResponse {
    tests: ITestResponseWithAttemptInfo[],
}

export interface NewCourseResponse {
    courseId: number, 
}

export interface IGetCourse {
    courseId: number,
}