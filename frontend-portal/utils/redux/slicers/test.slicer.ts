import RequestError from "@/utils/request/request.error";
import TestRequest from "@/utils/request/test.request";
import { AttemptHistoryResponse } from "@/utils/request/types/attempt.types";
import { IGetAllTests, IGetTest, ITestInfoForPreReq, ScoringFormats, TestTypes } from "@/utils/request/types/test.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../hooks";
import { formatDateTime } from "../../format";

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
	testOrder: ITestInfoForPreReq[],
	currIndex: number,
	courseInactive: boolean,
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
	testOrder: [],
	currIndex: 0,
	courseInactive: false,
}

const testSlice = createAppSlice({
	name: 'test',
	initialState,
	reducers: (create) => ({
		toggleSidebar: create.reducer((state) => {
			state.viewSidebar = !state.viewSidebar;
		}),
		setCurrIndex: create.reducer((state, action: PayloadAction<number>) => {
			state.currIndex = state.testOrder.findIndex((test) => test.testId === action.payload);
		}),
		navigateBack: create.reducer((state) => {
			state.currIndex--;
		}),
		navigateForward: create.reducer((state) => {
			state.currIndex++;
		}),
		// call before calling fetchTestInfo
		getAllTests: create.asyncThunk(
			async (params: IGetAllTests, thunkAPI) => {
				const response = await TestRequest.getAllTests(params);
				const testIds = response.map((test) => {
					return {
						testId: test.testId,
						title: test.testTitle,
						completed: test.completed,
					}
				});
				return testIds;
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
					state.testOrder = action.payload;
				},
				settled: (state) => {
					state.loading = false
				}
			}
		),
		fetchTestInfo: create.asyncThunk(
			async (params: IGetTest, thunkAPI) => {
				let {deadline, start, attempts, ...testInfo} = await TestRequest.getTest(params);
				if (start) {
					start = formatDateTime(new Date(start))
				}
				if (deadline) {
					deadline = formatDateTime(new Date(deadline))
				}
				for (const attempt of attempts) {
					if (attempt.submitted) {
						attempt.submitted = formatDateTime(new Date(attempt.submitted));
					}
				}
				return {deadline, start, attempts, ...testInfo};
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
						deadline, scoringFormat, courseInactive } = action.payload;
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
					state.courseInactive = courseInactive;
				},
				settled: (state) => {
					state.loading = false;
				}
			}
		),
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
		selectTestOrder: (state) => state.testOrder,
		selectCurrIndex: (state) => state.currIndex,
		selectCourseInactive: (state) => state.courseInactive,
	}
})

export const { toggleSidebar, fetchTestInfo, getAllTests,
	navigateBack, navigateForward, setCurrIndex,
} = testSlice.actions;

export const { selectAttemptHistory, selectTimeLimit, selectTestType,
	selectMaxScore, selectMaxAttempt, selectTestTitle,
	selectTestDescription, selectStartTime, selectDeadline,
	selectScoringFormat, selectCourseTitle, selectViewSidebar,
	selectCurrIndex, selectTestOrder, selectCourseInactive,
} = testSlice.selectors;

export default testSlice;
