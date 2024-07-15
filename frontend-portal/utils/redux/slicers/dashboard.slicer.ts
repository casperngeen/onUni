import CourseRequest from "@/utils/request/course.request";
import { createAppSlice } from "../hooks"

interface IInitialState {

}

const initialState: IInitialState = {

}


const dashboardSlice = createAppSlice({
    name: 'dashboard',
    initialState,
    reducers: (create) => ({
        fetchAllCourses: create.asyncThunk(
            async (thunkAPI) => {
                await CourseRequest.viewAllCourses();
                // start, end, progress, active
            },
            {
                pending: (state) => {

                },
                rejected: (state, action) => {

                },
                fulfilled: (state, action) => {

                },
                settled: (state) => {

                }
            }
        )
    }),
    selectors: {

    }
})

export const {} = dashboardSlice.actions;
export const {} = dashboardSlice.selectors;

export default dashboardSlice;