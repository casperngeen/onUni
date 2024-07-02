import { shuffleArray } from "@/app/course/[courseId]/test/[testId]/attempt/shuffle";
import { AttemptRequest } from "@/utils/request/attempt.request";
import QuestionRequest from "@/utils/request/question.request";
import TestRequest from "@/utils/request/test.request";
import { INewAttempt, ISaveAttempt, ISaveQuestionAttemptBody, OptionInfo, QuestionInfo } from "@/utils/request/types/attempt.types";
import { PayloadAction, asyncThunkCreator, buildCreateSlice, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

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
    setTestId: create.reducer((state, action: PayloadAction<number>) => {
      state.testId = action.payload;
    }),
    fetchAttempt: create.asyncThunk(
        async (params: INewAttempt, thunkAPI) => {
          const prevAttempt = localStorage.getItem('attemptId');
          if (prevAttempt) {
            const { questions, testTitle, courseTitle, timeLimit } = await TestRequest.getTestInfoForAttempt(params)
            const shuffledQuestions: QuestionInfo[]= shuffleArray(questions);
            for (let i = 0; i < questions.length; i++) {
              shuffledQuestions[i].options = shuffleArray(shuffledQuestions[i].options)
            }
            return { shuffledQuestions, attemptId: parseInt(prevAttempt), testTitle, courseTitle, timeLimit }
          } else {
            const {questions, attemptId, testTitle, courseTitle, timeLimit } = await AttemptRequest.createNewAttempt(params);
            const shuffledQuestions: QuestionInfo[]= shuffleArray(questions);
            for (let i = 0; i < questions.length; i++) {
              shuffledQuestions[i].options = shuffleArray(shuffledQuestions[i].options)
            }
            localStorage.setItem('attemptId', attemptId.toString());
            return { shuffledQuestions, attemptId, testTitle, courseTitle, timeLimit };
          }
        },
        {
          pending: state => {
            state.loading = true
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
          settled: (state, action) => {
            state.loading = false
          }
        }
    )
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
    }
})

export const { updateQuestionAnswer, bookmarkQuestion, unbookmarkQuestion, setTestId, fetchAttempt } = attemptSlice.actions;
export const { selectAttemptId, selectQuestionsAnswers, selectTestId,
  selectBookmarked, selectQuestions, selectLoading, 
  selectError, selectCourseTitle, selectTestTitle, 
  selectTimeLimit} = attemptSlice.selectors;
export default attemptSlice;