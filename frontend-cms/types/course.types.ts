export interface NewCourseBody extends Record<string, unknown> {
    "title": string,
    "description": string,
    "startDate": string,
    "endDate": string,
}

export interface NewUserBody {
    "userId": number,
}

export interface CourseResponse {
    courseId: number, 
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export interface NewCourseResponse {
    courseId: number, 
}