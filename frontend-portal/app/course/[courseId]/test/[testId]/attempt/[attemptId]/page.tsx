'use client'

import { UniCol, UniContainer, UniRow } from "@/components/overwrite/uni.components";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarHeader from "./sidebar/header/header";
import { exitSummary, getAttemptSummary, selectQuestions, setSubmitStatus } from "@/utils/redux/slicers/attempt.slicer";
import SideBarButtons from "./sidebar/button/button";
import SidebarQuestions from "./sidebar/question/sidebar.question";
import SingleQuestion from "./question/question";
import './attempt.scss';
import UniButton from "@/components/overwrite/uni.button";
import SummaryTitle from "./summary/summary";

const AttemptSummary: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString, attemptId: attemptIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const attemptId = Array.isArray(attemptIdString) ? parseInt(attemptIdString[0]) : parseInt(attemptIdString);
    
    const router = useRouter();
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const questions = selector(selectQuestions);

    const reAttempt = () => {
        dispatch(exitSummary());
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    }
    
    useEffect(() => {
        dispatch(getAttemptSummary({attemptId: attemptId}));

        const handleScroll = () => {
            const hash =  window.location.hash;
            if (hash) {
                const elementId = hash.replace('#', '');
                setTimeout(() => {
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        }

        handleScroll();
    }, [attemptId, dispatch]);


    return (
        <UniContainer fluid className="attempt">
            <UniRow className="attempt-wrapper">
                <UniCol className="col-md-3 sidebar">
                    <SidebarHeader />
                    <SidebarQuestions />
                    <SideBarButtons />
                </UniCol>
                <UniCol className="col-md-9 questions">
                    <div className="header">
                        <SummaryTitle />
                        <UniButton custombutton="exit" style={{width: 200}} onClick={reAttempt}>Re-attempt</UniButton>
                    </div>
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

export default AttemptSummary;