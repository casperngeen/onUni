import { shuffleArray } from "@/app/course/[courseId]/test/[testId]/attempt/shuffle";
import { AttemptRequest } from "@/utils/request/attempt.request";
import TestRequest from "@/utils/request/test.request";
import { AnswerStatus, IDeleteAttempt, IGetAttempt, INewAttempt, ISaveAttempt, ISaveQuestionAttemptBody, QuestionInfo } from "@/utils/request/types/attempt.types";
import { TestTypes } from "@/utils/request/types/test.types";
import { PayloadAction, asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

export enum SubmitStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  SUBMITTING = 'submitting',
  UNSUBMITTED = 'unsubmitted',
}

interface IInitialState {
  attemptId: number,
  testId: number,
  questionsAnswers: {[questionId: number]: number},
  bookmarked: number[],
  questions: QuestionInfo[],
  courseTitle: string,
  testTitle: string,
  timeLimit: number | null,
  loading: boolean,
  error: string | null,
  showSubmit: boolean,
  showExit: boolean,
  submitStatus: SubmitStatus,
  answers: {[questionId: number]: {optionId: number, isCorrect: boolean}},
  timeTaken: number,
  score: number,
  testType: TestTypes | null,
}

const initialState: IInitialState = {
  attemptId: -1,
  testId: -1,
  courseTitle: '',
  testTitle: '',
  timeLimit: null,
  questionsAnswers: {},
  bookmarked: [],
  questions: [],
  loading: false,
  error: null,
  showSubmit: false,
  showExit: false,
  submitStatus: SubmitStatus.UNSUBMITTED,
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
    createAttempt: create.asyncThunk(
      async (params: INewAttempt, thunkAPI) => {
        const testId = params.testId;
        const prevAttempt = localStorage.getItem('attemptId');
        if (prevAttempt) {
          const { questions, testTitle, courseTitle, timeLimit, testType } = await TestRequest.getTestInfoForAttempt(params)
          const shuffledQuestions: QuestionInfo[] = shuffleArray(questions);
          for (let i = 0; i < questions.length; i++) {
            shuffledQuestions[i].options = shuffleArray(shuffledQuestions[i].options)
          }
          return { testId, shuffledQuestions, attemptId: parseInt(prevAttempt), testTitle, courseTitle, timeLimit, testType }
        } else {
          const { questions, attemptId, testTitle, courseTitle, timeLimit, testType } = await AttemptRequest.createNewAttempt(params);
          const shuffledQuestions: QuestionInfo[]= shuffleArray(questions);
          for (let i = 0; i < questions.length; i++) {
            shuffledQuestions[i].options = shuffleArray(shuffledQuestions[i].options)
          }
          localStorage.setItem('attemptId', attemptId.toString());
          return { testId, shuffledQuestions, attemptId, testTitle, courseTitle, timeLimit, testType };
        }
      },
      {
        pending: state => {
          state.submitStatus = SubmitStatus.UNSUBMITTED;
          state.questionsAnswers = {};
          state.bookmarked = [];
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.payload instanceof Error) {
            state.error = action.payload.message
          }
        },
        fulfilled: (state, action) => {
          state.attemptId = action.payload.attemptId;
          state.questions = action.payload.shuffledQuestions;
          state.testTitle = action.payload.testTitle;
          state.courseTitle = action.payload.courseTitle;
          state.timeLimit = action.payload.timeLimit;
          state.testType = action.payload.testType;
          state.testId = action.payload.testId;
          const bookmark = localStorage.getItem(`bookmark-${state.testId}`)
          const answer = localStorage.getItem(`answer-${state.testId}`)
          if (bookmark) {
            state.bookmarked = JSON.parse(bookmark);
          }
          if (answer) {
            state.questionsAnswers = JSON.parse(answer);
          }
        },
        // settled is called for both rejected and fulfilled actions
        settled: state => {
          state.loading = false;
          state.submitStatus = SubmitStatus.UNSUBMITTED;
        }
      }
    ),
    submitAttempt: create.asyncThunk(
      async (params: ISaveAttempt, thunkAPI) => {
        await AttemptRequest.saveAttempt(params);
      },
      {
        pending: state => {
          state.submitStatus = SubmitStatus.SUBMITTING;
        },
        rejected: (state, action) => {
          if (action.payload instanceof Error) {
            state.error = action.payload.message;
          }
          state.submitStatus = SubmitStatus.FAILURE;
        },
        fulfilled: (state) => {
          state.submitStatus = SubmitStatus.SUCCESS;
        },
      }
    ),
    deleteAttempt: create.asyncThunk(
      async (params: IDeleteAttempt, thunkAPI) => {
        await AttemptRequest.deleteAttempt(params);
      },
      {
        pending: state => {
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.payload instanceof Error) {
            state.error = action.payload.message
          }
        },
        fulfilled: (state) => {},
        settled: state => {
          state.loading = false;
        }
      }
    ),
    getAttemptSummary: create.asyncThunk(
      async(params: IGetAttempt, thunkAPI) => {
        const { start, end, submitted, score, questionAttempts, questions, testTitle, courseTitle, testType } = await AttemptRequest.getAttempt(params);
        if (submitted) {
          const timeTaken = end
            ? Math.min(Date.parse(end), Date.parse(submitted)) - Date.parse(start)
            : Date.parse(submitted) - Date.parse(start);
          return { timeTaken, score, questionAttempts, questions, testTitle, courseTitle, testType };
        } else {
          return { questionAttempts, questions, testTitle, courseTitle, testType, timeTaken: null, score: null };
        }
      }, {
        pending: state => {
          state.loading = true;
        },
        rejected: (state, action) => {
          if (action.payload instanceof Error) {
            state.error = action.payload.message
          }
        },
        fulfilled: (state, action) => {
          state.submitStatus = SubmitStatus.SUCCESS;
          state.questions = action.payload.questions;
          state.testTitle = action.payload.testTitle;
          state.courseTitle = action.payload.courseTitle;
          state.testType = action.payload.testType;
          for (let i = 0; i < action.payload.questionAttempts.length; i++) {
            const qAttempt = action.payload.questionAttempts[i];
            const isCorrect = qAttempt.answerStatus === AnswerStatus.CORRECT;
            state.answers[qAttempt.questionId] = {optionId: qAttempt.selectedOptionId, isCorrect: isCorrect};
          }
          if (action.payload.score) {
            state.score = action.payload.score;
          }
          if (action.payload.timeTaken) {
            state.timeTaken = action.payload.timeTaken;
          }
          state.timeLimit = null;
        },
        settled: (state, action) => {
          state.loading = false
        }
    }),
    }),
    selectors: {
      selectAttemptId: (state) => state.attemptId,
      selectTestId: (state) => state.testId,
      selectQuestionsAnswers: (state) => state.questionsAnswers,
      selectBookmarked: (state) => state.bookmarked,
      selectQuestions: (state) => state.questions,
      selectCourseTitle: (state) => state.courseTitle,
      selectTestTitle: (state) => state.testTitle,
      selectTimeLimit: (state) => state.timeLimit,
      selectLoading: (state) => state.loading,
      selectError: (state) => state.error,
      selectShowSubmit: (state) => state.showSubmit,
      selectShowExit: (state) => state.showExit,
      selectSubmitStatus: (state) => state.submitStatus,
      selectAnswers: (state) => state.answers,
      selectScore: (state) => state.score,
      selectTimeTaken: (state) => state.timeTaken,
      selectTestType: (state) => state.testType,
    }
})

export const { updateQuestionAnswer, bookmarkQuestion, unbookmarkQuestion, 
  createAttempt, flipShowSubmit, getAttemptSummary,
  flipShowExit, submitAttempt, deleteAttempt,
  setSubmitStatus,
} = attemptSlice.actions;

export const { selectAttemptId, selectQuestionsAnswers, selectTestId,
  selectBookmarked, selectQuestions, selectLoading, 
  selectError, selectCourseTitle, selectTestTitle, 
  selectTimeLimit, selectShowSubmit, selectShowExit,
  selectSubmitStatus, selectAnswers, selectScore, 
  selectTimeTaken, selectTestType } = attemptSlice.selectors;

export default attemptSlice;