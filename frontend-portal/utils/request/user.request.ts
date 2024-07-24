import { RequestTypes } from "./types/base.types";
import { NewUserResponse, UserResponse } from "./types/user.types";
import BaseRequest from "./base.request";

export default class UserRequest extends BaseRequest {
  public async findStudentsInCourse(courseId: number) {
    return await BaseRequest.request<UserResponse[]>(
      `course/${courseId}/students`,
      RequestTypes.GET,
      {},
    );
  }

  public async findTeachersInCourse(courseId: number) {
    return await BaseRequest.request<UserResponse[]>(
      `course/${courseId}/teachers`,
      RequestTypes.GET,
      {},
    );
  }

  public async createNewTeacher(email: string) {
    return await BaseRequest.request<NewUserResponse>(
      `user/teacher`,
      RequestTypes.POST,
      { email: email },
    );
  }

  public async createNewStudent(email: string) {
    return await BaseRequest.request<NewUserResponse>(
      `user/student`,
      RequestTypes.POST,
      { email: email },
    );
  }

  public async deleteUser(userId: number) {
    await BaseRequest.request(`user/${userId}`, RequestTypes.DELETE, {});
  }
}
