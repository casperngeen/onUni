import CourseRequest from "@/utils/request/course.request";
import { createAppSlice } from "../hooks"
import { formatDate } from "@/utils/format";
import { AllCourseResponse, INextTest } from "@/utils/request/types/course.types";

interface IInitialState {
    activeCourses: AllCourseResponse[],
    inactiveCourses: AllCourseResponse[],
    nextTest: INextTest | null,
    loading: boolean,
    error: string | null,
    errorCode: number | null,
}

const initialState: IInitialState = {
    activeCourses: [],
    inactiveCourses: [],
    nextTest: null,
    loading: false,
    error: null,
    errorCode: null,
}


const dashboardSlice = createAppSlice({
    name: 'dashboard',
    initialState,
    reducers: (create) => ({
        fetchAllCourses: create.asyncThunk(
            async (thunkAPI) => {
                const { courses, nextTest } = await CourseRequest.viewAllCourses();
                const activeCourses = courses
                .filter((course) => Date.parse(course.startDate) < Date.now() && Date.parse(course.endDate) > Date.now())
                .map((course) => {
                    return {
                        startDate: formatDate(new Date(course.startDate)),
                        endDate: formatDate(new Date(course.endDate)),
                        title: course.title,
                        courseId: course.courseId,
                        progress: course.progress,
                    }
                })
                const inactiveCourses = courses
                .filter((course) => Date.parse(course.startDate) > Date.now())
                .map((course) => {
                    return {
                        startDate: formatDate(new Date(course.startDate)),
                        endDate: formatDate(new Date(course.endDate)),
                        title: course.title,
                        courseId: course.courseId,
                        progress: course.progress,
                    }
                })
                return { activeCourses, inactiveCourses, nextTest }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = null;
                    state.errorCode = null;
                },
                rejected: (state, action) => {

                },
                fulfilled: (state, action) => {
                    state.activeCourses = action.payload.activeCourses;
                    state.inactiveCourses = action.payload.inactiveCourses;
                    state.nextTest = action.payload.nextTest;
                },
                settled: (state) => {
                    state.loading = false;
                }
            }
        )
    }),
    selectors: {
        selectActiveCourses: (state) => state.activeCourses,
        selectInactiveCourses: (state) => state.inactiveCourses,
        selectNextTest: (state) => state.nextTest,
        selectLoading: (state) => state.loading,
        selectError: (state) => state.error,
        selectErrorCode: (state) => state.errorCode,
    }
})

export const { fetchAllCourses } = dashboardSlice.actions;
export const { selectActiveCourses, selectInactiveCourses, selectLoading,
    selectErrorCode, selectError, selectNextTest } = dashboardSlice.selectors;

export default dashboardSlice;