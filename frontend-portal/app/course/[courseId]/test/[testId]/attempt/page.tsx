import { useEffect } from "react";
import SingleQuestion from "./question";
import { QuestionInfo } from "@/utils/request/types/attempt.types";
import { AttemptRequest } from "@/utils/request/attempt.request";
import { shuffleArray } from "./shuffle";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { fetchAttempt, selectAnswerCount, selectAttemptId, selectBookmarked, selectError, selectLoading, selectQuestions, selectQuestionsAnswers } from "@/utils/redux/slicers/attempt.slicer";
import { UniContainer } from "@/components/overwrite/uni.components";

interface TestAttemptProps {
    testId: number,
    courseId: number,
}

const TestAttempt: React.FC<TestAttemptProps> = ({courseId, testId}) => {
    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const questions = selector(selectQuestions);
    const attemptId = selector(selectAttemptId);
    const answerCount = selector(selectAnswerCount);
    const bookmarked = selector(selectBookmarked);
    const questionAnswers = selector(selectQuestionsAnswers);
    const error = selector(selectError);
    const loading = selector(selectLoading);
    
    useEffect(() => {
        dispatch(fetchAttempt({testId: testId, courseId: courseId}))
    }, [courseId, dispatch, testId])

    return (
        <UniContainer>
            
        </UniContainer>
    );
}

const testQuestionInfo: QuestionInfo = {
    questionId: 1,
    questionText: 'This is the question text',
    options: [{
        optionId: 1,
        optionText: 'This is option 1',
    }, {
        optionId: 2,
        optionText: 'This is option 2',
    }, {
        optionId: 3,
        optionText: 'This is option 3',
    }]
}

const Attempt = () => {
    return (
        <div>
          <SingleQuestion questionInfo={testQuestionInfo} questionNumber={1}></SingleQuestion>
        </div>
      );
}

export default Attempt;