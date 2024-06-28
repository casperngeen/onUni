import { shuffleArray } from "@/app/course/[courseId]/test/[testId]/attempt/shuffle";
import { AttemptRequest } from "@/utils/request/attempt.request";
import { INewAttempt, ISaveAttempt, ISaveQuestionAttemptBody, OptionInfo, QuestionInfo } from "@/utils/request/types/attempt.types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  attemptId: number,
  questionsAnswers: {[questionId: number]: number},
  answerCount: number,
  bookmarked: number[],
  questions: QuestionInfo[],
  loading: boolean,
  error: string | null,
}

// store is a temp storage -> used for rendering current info
// global state store
const initialState: IInitialState = {
  attemptId: -1,
  questionsAnswers: {},
  answerCount: 0,
  bookmarked: [],
  questions: [],
  loading: false,
  error: null,
}

const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: (create) => ({
    incrementAnswerCount: create.reducer((state) => {
      state.answerCount++;
    }),
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
   fetchAttempt: create.asyncThunk(
      async (params: INewAttempt, thunkAPI) => {
        const { attemptId, questions} = await AttemptRequest.createNewAttempt(params);
        const shuffledQuestions = shuffleArray(questions);
        return { attemptId, shuffledQuestions };
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
    selectAnswerCount: (state) => state.answerCount,
    selectQuestionsAnswers: (state) => state.questionsAnswers,
    selectBookmarked: (state) => state.bookmarked,
    selectQuestions: (state) => state.questions,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
  }
})

export const { incrementAnswerCount, updateQuestionAnswer, bookmarkQuestion, unbookmarkQuestion, fetchAttempt } = attemptSlice.actions;
export const { selectAttemptId, selectAnswerCount, selectQuestionsAnswers, selectBookmarked, selectQuestions, selectLoading ,selectError } = attemptSlice.selectors;
export default attemptSlice;