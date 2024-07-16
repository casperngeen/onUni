import { RequestTypes } from "./types/base.types";
import { AllCourseResponseObject, IGetCourse, NewCourseBody, NewCourseResponse, NewUserBody, SingleCourseResponse } from "./types/course.types";
import BaseRequest from "./base.request";

export default class CourseRequest extends BaseRequest {
    public static async viewAllCourses() {
        return await BaseRequest.request<AllCourseResponseObject>('course', RequestTypes.GET, {});
    }

    public static async viewCourse(params: IGetCourse) {
        const { courseId } = params;
        return await BaseRequest.request<SingleCourseResponse>(`course/${courseId}`, RequestTypes.GET, {});
    }

    public static async createNewCourse(newCourse: NewCourseBody) {
        const data = await BaseRequest.request<NewCourseResponse>('course', RequestTypes.POST, newCourse)
        return data.courseId;
    }

    public static async updateCourse(id: number, courseDetails: NewCourseBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.PUT, courseDetails)
    }

    public static async addUserToCourse(id: number, user: NewUserBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.PUT, user)
    }

    public static async deleteUserFromCourse(id: number, user: NewUserBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.DELETE, user)
    }

    public static async deleteCourse(id: number) {
        await BaseRequest.request(`course/${id}`, RequestTypes.DELETE, {})
    }
}