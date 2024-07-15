import CourseRequest from "@/utils/request/course.request";
import { createAppSlice } from "../utils/hooks"
import { IGetCourse, SingleCourseResponse } from "@/utils/request/types/course.types";
import { ITestInfoForAttemptResponse } from "@/utils/request/types/attempt.types";
import { ITestResponseWithAttemptInfo } from "@/utils/request/types/test.types";
import RequestError from "@/utils/request/request.error";
import { formatDate } from "../utils/format.date";

interface IInitialState {
    courseTitle: string,
    courseDescription: string,
    tests: ITestResponseWithAttemptInfo[],
    startDate: string,
    endDate: string,
    loading: boolean,
    error: string | null,
    errorCode: number | null,
}

const initialState: IInitialState = {
    courseTitle: '',
    courseDescription: '',
    tests: [],
    startDate: '',
    endDate: '',
    loading: false,
    error: null,
    errorCode: null,
}

const courseSlice = createAppSlice({
    name: 'course',
    initialState,
    reducers: (create) => ({
        fetchCourseInfo: create.asyncThunk(
            async (params: IGetCourse, thunkAPI) => {
                try {
                    let { startDate, endDate, title, description, tests } = await CourseRequest.viewCourse(params);
                    
                    startDate = formatDate(new Date(startDate));
                    endDate = formatDate(new Date(endDate));
                    return {startDate, endDate, title, description, tests};
                } catch (error) {
                    if (error instanceof RequestError) {
                        return thunkAPI.rejectWithValue({message: error.message, code: error.getErrorCode()})
                    } else if (error instanceof Error) {
                        return thunkAPI.rejectWithValue(error.message);
                    }
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                    state.errorCode = null;
                },
                rejected: (state, action) => {
                    state.error = action.error.message ? action.error.message : "Unknown error";
                    state.errorCode = action.error.code ? parseInt(action.error.code) : null;
                },
                fulfilled: (state, action) => {
                    const { startDate, endDate, title, description, tests } = action.payload as SingleCourseResponse;
                    state.courseTitle = title;
                    state.courseDescription = description;
                    state.startDate = startDate;
                    state.endDate = endDate;
                    state.tests = tests; 
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
        selectErrorMessage: (state) => state.error,
        selectErrorCode: (state) => state.errorCode,
        selectLoading: (state) => state.loading,
    }
})

export const {fetchCourseInfo} = courseSlice.actions;

export const {
    selectCourseDescription, selectCourseTitle, selectTests,
    selectStartDate, selectEndDate, selectErrorMessage, 
    selectErrorCode, selectLoading
} = courseSlice.selectors;

export default courseSlice;