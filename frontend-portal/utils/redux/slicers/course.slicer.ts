import CourseRequest from "@/utils/request/course.request";
import { createAppSlice } from "../hooks"
import { IGetCourse } from "@/utils/request/types/course.types";
import { ITestResponseWithAttemptInfo } from "@/utils/request/types/test.types";
import RequestError from "@/utils/request/request.error";
import { formatDate } from "../../format";

interface IInitialState {
    courseTitle: string,
    courseDescription: string,
    tests: ITestResponseWithAttemptInfo[],
    startDate: string,
    endDate: string,
    loading: boolean,
    errorMessage: string | null,
    errorCode: number | null,
    courseInactive: boolean,
}

const initialState: IInitialState = {
    courseTitle: '',
    courseDescription: '',
    tests: [],
    startDate: '',
    endDate: '',
    loading: false,
    errorMessage: null,
    errorCode: null,
    courseInactive: false,
}

const courseSlice = createAppSlice({
    name: 'course',
    initialState,
    reducers: (create) => ({
        resetError: create.reducer((state) => {
            state.errorCode = null;
            state.errorMessage = null;
        }),
        fetchCourseInfo: create.asyncThunk.withTypes<{rejectValue: {message: string, errorCode: number}}>()(
            async (params: IGetCourse, thunkAPI) => {
                try {
                    let { startDate, endDate, title, description, tests } = await CourseRequest.viewCourse(params);
                    const courseInactive = Date.parse(startDate) > Date.now() || Date.parse(endDate) < Date.now();
                    startDate = formatDate(new Date(startDate));
                    endDate = formatDate(new Date(endDate));
                    return {startDate, endDate, title, description, tests, courseInactive};
                } catch (error) {
                    if (error instanceof RequestError) {
                        return thunkAPI.rejectWithValue({message: error.message, errorCode: error.getErrorCode()})
                    }
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                },
                rejected: (state, action) => {
                    if (action.payload) {
                        state.errorMessage = action.payload.message;
                        state.errorCode = action.payload.errorCode;
                    }
                },
                fulfilled: (state, action) => {
                    const { startDate, endDate, title, description, tests, courseInactive } = action.payload as { startDate: string; endDate: string; title: string; description: string; tests: ITestResponseWithAttemptInfo[]; courseInactive: boolean; };
                    state.courseTitle = title;
                    state.courseDescription = description;
                    state.startDate = startDate;
                    state.endDate = endDate;
                    state.tests = tests; 
                    state.courseInactive = courseInactive;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }
        )
    }),
    selectors: {
        selectCourseTitle: (state) => state.courseTitle,
        selectCourseDescription: (state) => state.courseDescription,
        selectTests: (state) => state.tests,
        selectStartDate: (state) => state.startDate,
        selectEndDate: (state) => state.endDate,
        selectErrorMessage: (state) => state.errorMessage,
        selectErrorCode: (state) => state.errorCode,
        selectLoading: (state) => state.loading,
        selectCourseInactive: (state) => state.courseInactive,
    }
})

export const {
    fetchCourseInfo, resetError,
} = courseSlice.actions;

export const {
    selectCourseDescription, selectCourseTitle, selectTests,
    selectStartDate, selectEndDate, selectErrorMessage, 
    selectErrorCode, selectLoading, selectCourseInactive,
} = courseSlice.selectors;

export default courseSlice;