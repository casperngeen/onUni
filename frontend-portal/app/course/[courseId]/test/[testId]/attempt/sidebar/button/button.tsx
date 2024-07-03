import UniButton from '@/components/overwrite/uni.button';
import './button.scss';
import { useAppDispatch, useAppSelector } from '@/utils/redux/utils/hooks';
import { SubmitStatus, flipShowExit, flipShowSubmit, selectAttemptId, selectQuestions, selectQuestionsAnswers, selectSubmitStatus, selectTestType, selectTimeLimit, submitAttempt } from '@/utils/redux/slicers/attempt.slicer';
import { useParams, useRouter } from 'next/navigation';
import { TestTypes } from '@/utils/request/types/test.types';

const SideBarButtons: React.FC<{}> = () => {
    const router = useRouter();
    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const questionsAnswered = selector(selectQuestionsAnswers);
    const questions = selector(selectQuestions);
    const isSummary = selector(selectSubmitStatus) === SubmitStatus.SUCCESS;
    const isQuiz = selector(selectTestType) === TestTypes.QUIZ;
    const attemptId = selector(selectAttemptId);

    const openSubmit = () => {
        if (Object.keys(questionsAnswered).length < questions.length) {
            dispatch(flipShowSubmit());
        } else {
            dispatch(submitAttempt({attemptId: attemptId}));
        }
    }

    const openExit = () => {
        dispatch(flipShowExit());
    }

    const reAttempt = () => {
        router.push(`course/${courseId}/test/${testId}/attempt`);
    }

    const leavePage = () => {
        router.push(`course/${courseId}/test/${testId}`);
    }

    return (
        <div className="sidebar-buttons">
            {
                isSummary
                ? <>
                    {isQuiz &&
                        <div className="d-flex flex-column">
                            <UniButton custombutton='confirm' onClick={reAttempt}>Re-attempt</UniButton>
                            <div className='button-gap' />
                        </div>
                    }
                    <UniButton custombutton='exit' onClick={leavePage}>Exit</UniButton>
                </>
                : <>
                    <UniButton custombutton='confirm' onClick={openSubmit}>Submit</UniButton>
                    {isQuiz &&
                        <div className="d-flex flex-column">
                            <div className='button-gap' />
                            <UniButton custombutton='exit' onClick={openExit}>Exit</UniButton>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default SideBarButtons;