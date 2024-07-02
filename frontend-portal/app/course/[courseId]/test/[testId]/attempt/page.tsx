"use client"

import { useEffect } from "react";
import SingleQuestion from "./question/question";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { fetchAttempt, selectError, selectLoading, selectQuestions, setTestId } from "@/utils/redux/slicers/attempt.slicer";
import { UniCol, UniContainer, UniRow } from "@/components/overwrite/uni.components";
import './attempt.scss'
import SidebarQuestions from "./sidebar/question/sidebar.question";
import SidebarProgressBar from "./sidebar/progress/progress.bar";
import SidebarHeader from "./sidebar/header/header";
import SideBarButtons from "./sidebar/button/button";

interface TestAttemptProps {
    testId: number,
    courseId: number,
}

const TestAttempt: React.FC<TestAttemptProps> = ({courseId, testId}) => {
    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const questions = selector(selectQuestions);
    const error = selector(selectError);
    const loading = selector(selectLoading);

    dispatch(setTestId(testId));
    
    useEffect(() => {
        dispatch(fetchAttempt({testId: testId, courseId: courseId}));
        console.log('Fetched data');
    }, [courseId, dispatch, testId])

    return (
        <UniContainer className="attempt">
            <UniRow className="h-100">
                <UniCol className="col-md-3 sidebar">
                    <SidebarHeader />
                    <SidebarProgressBar />
                    <SidebarQuestions />
                    <SideBarButtons />
                </UniCol>
                <UniCol className="col-md-9 questions">
                    {questions.map((question, index) => (
                        <div key={question.questionId} id={`question-${index+1}`}>
                            <SingleQuestion questionInfo={question} questionNumber={index+1}></SingleQuestion>
                        </div>
                    ))}
                </UniCol>
            </UniRow>
        </UniContainer>
    );
}

export default TestAttempt;