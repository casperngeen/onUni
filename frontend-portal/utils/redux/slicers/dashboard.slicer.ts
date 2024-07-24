import CourseRequest from "@/utils/request/course.request";
import { createAppSlice, useAppDispatch } from "../hooks";
import { formatDate } from "@/utils/format";
import {
  AllCourseResponse,
  INextTest,
} from "@/utils/request/types/course.types";
import RequestError from "@/utils/request/request.error";

interface IInitialState {
  activeCourses: AllCourseResponse[];
  inactiveCourses: AllCourseResponse[];
  nextTest: INextTest | null;
  loading: boolean;
  errorMessage: string | null;
  errorCode: number | null;
}

const initialState: IInitialState = {
  activeCourses: [],
  inactiveCourses: [],
  nextTest: null,
  loading: false,
  errorMessage: null,
  errorCode: null,
};

const dashboardSlice = createAppSlice({
  name: "dashboard",
  initialState,
  reducers: (create) => ({
    resetError: create.reducer((state) => {
      state.errorCode = null;
      state.errorMessage = null;
    }),
    fetchAllCourses: create.asyncThunk.withTypes<{
      rejectValue: { message: string; errorCode: number };
    }>()(
      async (params, thunkAPI) => {
        try {
          const { courses, nextTest } = await CourseRequest.viewAllCourses();
          const activeCourses = courses
            .filter(
              (course) =>
                Date.parse(course.startDate) < Date.now() &&
                Date.parse(course.endDate) > Date.now(),
            )
            .map((course) => {
              return {
                startDate: formatDate(new Date(course.startDate)),
                endDate: formatDate(new Date(course.endDate)),
                title: course.title,
                courseId: course.courseId,
                progress: course.progress,
              };
            });
          const inactiveCourses = courses
            .filter((course) => Date.parse(course.startDate) > Date.now())
            .map((course) => {
              return {
                startDate: formatDate(new Date(course.startDate)),
                endDate: formatDate(new Date(course.endDate)),
                title: course.title,
                courseId: course.courseId,
                progress: course.progress,
              };
            });
          return { activeCourses, inactiveCourses, nextTest };
        } catch (error) {
          if (error instanceof RequestError) {
            return thunkAPI.rejectWithValue({
              message: error.message,
              errorCode: error.getErrorCode(),
            });
          }
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.errorCode = null;
          state.errorMessage = null;
        },
        rejected: (state, action) => {
          if (action.payload) {
            state.errorCode = action.payload.errorCode;
            state.errorMessage = action.payload.message;
          }
        },
        fulfilled: (state, action) => {
          if (action.payload) {
            state.activeCourses = action.payload.activeCourses;
            state.inactiveCourses = action.payload.inactiveCourses;
            state.nextTest = action.payload.nextTest;
          }
        },
        settled: (state) => {
          state.loading = false;
        },
      },
    ),
  }),
  selectors: {
    selectActiveCourses: (state) => state.activeCourses,
    selectInactiveCourses: (state) => state.inactiveCourses,
    selectNextTest: (state) => state.nextTest,
    selectLoading: (state) => state.loading,
    selectErrorMessage: (state) => state.errorMessage,
    selectErrorCode: (state) => state.errorCode,
  },
});

export const { fetchAllCourses, resetError } = dashboardSlice.actions;
export const {
  selectActiveCourses,
  selectInactiveCourses,
  selectLoading,
  selectErrorCode,
  selectErrorMessage,
  selectNextTest,
} = dashboardSlice.selectors;

export default dashboardSlice;
