import { AttemptRequest } from "@/utils/request/attempt.request";
import { AnswerStatus, IDeleteAttempt, IGetAttempt, IGetCurrentAttempt, ISaveAttempt, ISaveQuestionAttemptBody, QuestionInfo, Status } from "@/utils/request/types/attempt.types";
import { TestTypes } from "@/utils/request/types/test.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../hooks";
import RequestError from "@/utils/request/request.error";

export enum SubmitStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  SUBMITTING = 'submitting',
  UNSUBMITTED = 'unsubmitted',
}

interface IInitialState {
  questionsAnswers: {[questionId: number]: number},
  bookmarked: number[],
  questions: QuestionInfo[],
  courseTitle: string,
  testTitle: string,
  timeRemaining: number | null,
  loading: boolean,
  errorMessage: string | null,
  errorCode: number | null,
  showSubmit: boolean,
  showExit: boolean,
  submitStatus: SubmitStatus,
  answers: {[questionId: number]: {optionId: number, isCorrect: boolean}},
  timeTaken: number,
  score: number,
  testType: TestTypes | null,
  readyForView: boolean,
}

const initialState: IInitialState = {
  courseTitle: '',
  testTitle: '',
  timeRemaining: null,
  questionsAnswers: {},
  bookmarked: [],
  questions: [],
  loading: false,
  errorMessage: null,
  errorCode: null,
  showSubmit: false,
  showExit: false,
  submitStatus: SubmitStatus.UNSUBMITTED,
  readyForView: false,
  answers: {},
  timeTaken: -1,
  score: -1,
  testType: null,
}

const attemptSlice = createAppSlice({
  name: 'attempt',
  initialState,
  reducers: (create) => ({
    updateQuestionAnswer: create.reducer((state, action: PayloadAction<ISaveQuestionAttemptBody>) => {
      state.questionsAnswers[action.payload.questionId] = action.payload.selectedOptionId;
    }),
    bookmarkQuestion: create.reducer((state, action: PayloadAction<number>) => {
      if (!state.bookmarked.includes(action.payload)) {
        state.bookmarked.push(action.payload);
      }
    }),
    unbookmarkQuestion: create.reducer((state, action: PayloadAction<number>) => {
      const index = state.bookmarked.indexOf(action.payload)
      if (index != -1) {
        state.bookmarked.splice(index, 1);
      }
    }),
    flipShowSubmit: create.reducer((state) => {
      state.showSubmit = !state.showSubmit;
    }),
    flipShowExit: create.reducer((state) => {
      state.showExit = !state.showExit;
    }),
    setSubmitStatus: create.reducer((state, action: PayloadAction<SubmitStatus>) => {
      state.submitStatus = action.payload;
    }),
    exitSummary: create.reducer((state) => {
      state.readyForView = false;
    }),
    resetError: create.reducer((state) => {
      state.errorCode = null;
      state.errorMessage = null;
    }),
    resetState: create.reducer((state) => {
      state = initialState;
    }),
    submitAttempt: create.asyncThunk.withTypes<{rejectValue: {message: string, errorCode: number}}>()(
      async (params: ISaveAttempt, thunkAPI) => {
        try {
          await AttemptRequest.saveAttempt(params);
        } catch (error) {
          if (error instanceof RequestError) {
            return thunkAPI.rejectWithValue({message: error.message, errorCode: error.getErrorCode()})
          }
        }
      },
      {
        pending: state => {
          state.submitStatus = SubmitStatus.SUBMITTING;
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.payload) {
            state.errorMessage = action.payload.message;
            state.errorCode = action.payload.errorCode;
          }
          state.submitStatus = SubmitStatus.FAILURE;
        },
        fulfilled: (state) => {
          state.submitStatus = SubmitStatus.SUCCESS;
        },
        settled: (state) => {
          state.bookmarked = [];
          state.timeRemaining = null;
        }
      }
    ),
    deleteAttempt: create.asyncThunk.withTypes<{rejectValue: {message: string, errorCode: number}}>()(
      async (params: IDeleteAttempt, thunkAPI) => {
        try {
          await AttemptRequest.deleteAttempt(params);
        } catch (error) {
          if (error instanceof RequestError) {
            return thunkAPI.rejectWithValue({message: error.message, errorCode: error.getErrorCode()})
          }
        }
      },
      {
        pending: state => {
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.payload) {
            state.errorMessage = action.payload.message;
            state.errorCode = action.payload.errorCode;
          }
        },
        fulfilled: (state) => {},
        settled: (state) => {
          state.loading = false;
          state.bookmarked = [];
        }
      }
    ),
    getAttempt: create.asyncThunk.withTypes<{rejectValue: {message: string, errorCode: number}}>()(
      async(params: IGetAttempt, thunkAPI) => {
        try {
          return await AttemptRequest.getAttempt(params);
        } catch (error) {
          if (error instanceof RequestError) {
            return thunkAPI.rejectWithValue({message: error.message, errorCode: error.getErrorCode()})
          }
        }  
      }, {
        pending: state => {
          state.loading = true;
          state.answers = {};
          state.questionsAnswers = {};
          state.bookmarked = [];
        },
        rejected: (state, action) => {
          if (action.payload) {
            state.errorMessage = action.payload.message;
            state.errorCode = action.payload.errorCode;
          }
        },
        fulfilled: (state, action) => {
          if (action.payload) {
            state.questions = action.payload.questions;
            state.testTitle = action.payload.testTitle;
            state.courseTitle = action.payload.courseTitle;
            state.testType = action.payload.testType;
            if (action.payload.timeRemaining) {
              state.timeRemaining = Math.floor(action.payload.timeRemaining/1000) + 1
            }
            if (action.payload.status === Status.SUBMIT || action.payload.status === Status.AUTOSUBMIT) {
              state.submitStatus = SubmitStatus.SUCCESS;
              for (let i = 0; i < action.payload.questionAttempts.length; i++) {
                const qAttempt = action.payload.questionAttempts[i];
                const isCorrect = qAttempt.answerStatus === AnswerStatus.CORRECT;
                state.answers[qAttempt.questionId] = {optionId: qAttempt.selectedOptionId, isCorrect: isCorrect};
              }
              if (action.payload.score !== null) {
                state.score = action.payload.score;
              }
              if (action.payload.timeTaken) {
                state.timeTaken = action.payload.timeTaken;
              }
              state.readyForView = true;
            } else {
              state.submitStatus = SubmitStatus.UNSUBMITTED;
              const bookmark = localStorage.getItem(`bookmark-${action.payload.attemptId}`)
              if (bookmark) {
                state.bookmarked = JSON.parse(bookmark);
              } else {
                state.bookmarked = [];
              }
              for (const qAttempt of action.payload.questionAttempts) {
                state.questionsAnswers[qAttempt.questionId] = qAttempt.selectedOptionId;
              }
              state.readyForView = false;
            }
          }
        },
        settled: (state) => {
          state.loading = false;
        }
    }),
  }),
  selectors: {
      selectQuestionsAnswers: (state) => state.questionsAnswers,
      selectBookmarked: (state) => state.bookmarked,
      selectQuestions: (state) => state.questions,
      selectCourseTitle: (state) => state.courseTitle,
      selectTestTitle: (state) => state.testTitle,
      selectTimeRemaining: (state) => state.timeRemaining,
      selectLoading: (state) => state.loading,
      selectErrorMessage: (state) => state.errorMessage,
      selectErrorCode: (state) => state.errorCode,
      selectShowSubmit: (state) => state.showSubmit,
      selectShowExit: (state) => state.showExit,
      selectSubmitStatus: (state) => state.submitStatus,
      selectAnswers: (state) => state.answers,
      selectScore: (state) => state.score,
      selectTimeTaken: (state) => state.timeTaken,
      selectTestType: (state) => state.testType,
      selectViewStatus: (state) => state.readyForView,
  }
})

export const { updateQuestionAnswer, bookmarkQuestion, unbookmarkQuestion, 
  flipShowSubmit, getAttempt, exitSummary,
  flipShowExit, submitAttempt, deleteAttempt,
  setSubmitStatus, resetError, resetState,
} = attemptSlice.actions;

export const { selectQuestionsAnswers, selectViewStatus, selectErrorCode,
  selectBookmarked, selectQuestions, selectLoading, 
  selectErrorMessage, selectCourseTitle, selectTestTitle, 
  selectTimeRemaining, selectShowSubmit, selectShowExit,
  selectSubmitStatus, selectAnswers, selectScore, 
  selectTimeTaken, selectTestType  } = attemptSlice.selectors;

export default attemptSlice;