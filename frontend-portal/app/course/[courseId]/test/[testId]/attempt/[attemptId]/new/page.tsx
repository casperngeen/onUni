'use client'

import { useEffect } from "react";
import SingleQuestion from "../question/question";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { fetchAttempt, selectQuestions } from "@/utils/redux/slicers/attempt.slicer";
import { UniCol, UniContainer, UniRow } from "@/components/overwrite/uni.components";
import '../attempt.scss';
import SidebarQuestions from "../sidebar/question/sidebar.question";
import SidebarProgressBar from "../sidebar/progress/progress.bar";
import SidebarHeader from "../sidebar/header/header";
import SideBarButtons from "../sidebar/button/button";
import WarningModal, { ModalType } from "../modals/warning.modal";
import { useParams } from "next/navigation";
import SubmttingModal from "../modals/submitting.modal";

const TestAttempt: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString, attemptId: attemptIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const attemptId = Array.isArray(attemptIdString) ? parseInt(attemptIdString[0]) : parseInt(attemptIdString);

    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const questions = selector(selectQuestions);

    useEffect(() => { 
        dispatch(fetchAttempt({
            testId: testId, 
            courseId: courseId, 
            attemptId: attemptId
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId, courseId, testId])

    useEffect(() => {
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
    }, []);

    return (
        <>
            <UniContainer className="attempt" fluid>
                <UniRow className="attempt-wrapper">
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

            <WarningModal type={ModalType.EXIT} />
            <WarningModal type={ModalType.SUBMIT} />
            <SubmttingModal />
        </>
    );
}

export default TestAttempt;