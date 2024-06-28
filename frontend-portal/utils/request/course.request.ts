import { ApiResponse, RequestTypes } from "./types/base.types";
import { CourseResponse, NewCourseBody, NewCourseResponse, NewUserBody } from "./types/course.types";
import BaseRequest from "./base.request";

export default class CourseRequest extends BaseRequest {
    public async viewAllCourses() {
        return await BaseRequest.request<CourseResponse[]>('course', RequestTypes.GET, {});
    }

    public async viewCourse(id: number) {
        return await BaseRequest.request<CourseResponse[]>(`course/${id}`, RequestTypes.GET, {});
    }

    public async createNewCourse(newCourse: NewCourseBody) {
        const data = await BaseRequest.request<NewCourseResponse>('course', RequestTypes.POST, newCourse)
        return data.courseId;
    }

    public async updateCourse(id: number, courseDetails: NewCourseBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.PUT, courseDetails)
    }

    public async addUserToCourse(id: number, user: NewUserBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.PUT, user)
    }

    public async deleteUserFromCourse(id: number, user: NewUserBody) {
        await BaseRequest.request(`course/${id}`, RequestTypes.DELETE, user)
    }

    public async deleteCourse(id: number) {
        await BaseRequest.request(`course/${id}`, RequestTypes.DELETE, {})
    }
}