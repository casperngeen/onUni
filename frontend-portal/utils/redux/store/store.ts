import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import attemptSlice from "../slicers/attempt.slicer";
import testSlice from "../slicers/test.slicer";
import courseSlice from "../slicers/course.slicer";
import dashboardSlice from "../slicers/dashboard.slicer";
import authSlice from "../slicers/auth.slicer";

const rootReducer = combineSlices(attemptSlice, testSlice, courseSlice, dashboardSlice, authSlice);
export type RootState = ReturnType<typeof rootReducer>;


// const listenerMiddleware = createListenerMiddleware();

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    // middleware: (getDefaultMiddleware) => {
    //   return getDefaultMiddleware().concat(attemptSlicer.middleware);
    // },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;