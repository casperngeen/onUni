import RequestError from "@/utils/request/request.error";
import TestRequest from "@/utils/request/test.request";
import { AttemptHistoryResponse } from "@/utils/request/types/attempt.types";
import { IGetTest, ScoringFormats, TestTypes } from "@/utils/request/types/test.types";
import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

export const createAppSlice = buildCreateSlice({
	creators: { asyncThunk: asyncThunkCreator },
})

interface IInitialState {
	attemptHistory: AttemptHistoryResponse[],
	timeLimit: number | null,
	testType: TestTypes,
	maxScore: number,
	maxAttempt: number | null,
	courseTitle: string,
	testTitle: string,
	testDescription: string,
	start: string | null,
	deadline: string | null,
	scoringFormat: ScoringFormats | null,
	viewSidebar: boolean,
	loading: boolean,
	errorCode: number | null,
	error: string | null,
}

const initialState: IInitialState = {
	attemptHistory: [],
	timeLimit: null,
	testType: TestTypes.QUIZ,
	maxScore: 0,
	maxAttempt: null,
	courseTitle: '',
	testTitle: '',
	testDescription: '',
	start: null,
	deadline: null,
	scoringFormat: null,
	viewSidebar: true,
	loading: false,
	errorCode: null,
	error: null,
}

const testSlice = createAppSlice({
	name: 'test',
	initialState,
	reducers: (create) => ({
		toggleSidebar: create.reducer((state) => {
			state.viewSidebar = !state.viewSidebar;
		}),
		fetchTestInfo: create.asyncThunk(
			async (params: IGetTest, thunkAPI) => {
				return await TestRequest.getTest(params);
			}, 
			{
				pending: (state) => {
					state.loading = true;
					state.error = null;
					state.errorCode = null;
				},
				rejected: (state, action) => {
					if (action.payload instanceof RequestError) {
						state.error = action.payload.message;
						state.errorCode = action.payload.getErrorCode();
					}
				},
				fulfilled: (state, action) => {
					const { attempts, timeLimit, testType, 
						maxAttempt, maxScore, testTitle, 
						testDescription, courseTitle, start, 
						deadline, scoringFormat } = action.payload;
					state.attemptHistory = attempts;
					state.timeLimit = timeLimit;
					state.start = start,
					state.deadline = deadline;
					state.testType = testType;
					state.maxAttempt = maxAttempt;
					state.maxScore = maxScore;
					state.testTitle = testTitle;
					state.testDescription = testDescription;
					state.courseTitle = courseTitle;
					state.scoringFormat = scoringFormat;
				},
				settled: (state) => {
					state.loading = false;
				}
			}
		)
	}),
	selectors: {
		selectAttemptHistory: (state) => state.attemptHistory,
		selectTimeLimit: (state) => state.timeLimit,
		selectTestType: (state) => state.testType,
		selectMaxScore: (state) => state.maxScore,
		selectMaxAttempt: (state) => state.maxAttempt,
		selectTestTitle: (state) => state.testTitle,
		selectTestDescription: (state) => state.testDescription,
		selectStartTime: (state) => state.start,
		selectDeadline: (state) => state.deadline,
		selectScoringFormat: (state) => state.scoringFormat,
		selectViewSidebar: (state) => state.viewSidebar,
		selectCourseTitle: (state) => state.courseTitle,
	}
})

export const {toggleSidebar, fetchTestInfo} = testSlice.actions;

export const {selectAttemptHistory, selectTimeLimit, selectTestType,
	selectMaxScore, selectMaxAttempt, selectTestTitle,
	selectTestDescription, selectStartTime, selectDeadline,
	selectScoringFormat, selectCourseTitle, selectViewSidebar,
} = testSlice.selectors;

export default testSlice;
