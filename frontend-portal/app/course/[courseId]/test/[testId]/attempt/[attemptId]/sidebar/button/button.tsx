'use client'

import UniButton from '@/components/overwrite/uni.button';
import './button.scss';
import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks';
import { SubmitStatus, exitSummary, flipShowExit, flipShowSubmit, selectQuestions, selectQuestionsAnswers, selectSubmitStatus, selectTestType, setSubmitStatus, submitAttempt } from '@/utils/redux/slicers/attempt.slicer';
import { useParams, useRouter } from 'next/navigation';
import { TestTypes } from '@/utils/request/types/test.types';

const SideBarButtons: React.FC<{}> = () => {
    const router = useRouter();
    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const { courseId: courseIdString, testId: testIdString, attemptId: attemptIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const attemptId = Array.isArray(attemptIdString) ? parseInt(attemptIdString[0]) : parseInt(attemptIdString);
    const questionsAnswered = selector(selectQuestionsAnswers);
    const questions = selector(selectQuestions);
    const isSummary = selector(selectSubmitStatus) === SubmitStatus.SUCCESS;
    const isQuiz = selector(selectTestType) === TestTypes.QUIZ;

    const openSubmit = () => {
        if (Object.keys(questionsAnswered).length < questions.length) {
            dispatch(flipShowSubmit());
        } else {
            localStorage.removeItem(`bookmark-${testId}`);
            dispatch(submitAttempt({attemptId: attemptId}));
        }
    }

    const openExit = () => {
        dispatch(flipShowExit());
    }

    const reAttempt = () => {
        dispatch(exitSummary());
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    }

    const leavePage = () => {
        dispatch(exitSummary());
        router.push(`/course/${courseId}/test/${testId}`);
    }

    return isSummary          
    ? <div className="sidebar-buttons">
        {isQuiz && <UniButton custombutton='confirm' onClick={reAttempt}>Re-attempt</UniButton>}
        <UniButton custombutton='exit' onClick={leavePage}>Exit</UniButton>     
    </div>
    : <div className="sidebar-buttons">
        <UniButton custombutton='confirm' onClick={openSubmit}>Submit</UniButton>
        {isQuiz && <UniButton custombutton='exit' onClick={openExit}>Exit</UniButton>}
    </div>
}

export default SideBarButtons;