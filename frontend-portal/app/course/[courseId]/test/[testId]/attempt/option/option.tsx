'use client'

import { OptionInfo } from "@/utils/request/types/attempt.types";
import Form from 'react-bootstrap/Form';
import { incrementAnswerCount, updateQuestionAnswer, selectAnswerCount, selectQuestionsAnswers, selectAttemptId, selectTestId } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { AttemptRequest } from "@/utils/request/attempt.request";

interface SingleOptionProps {
    questionId: number,
    option: OptionInfo,
}

const SingleOption: React.FC<SingleOptionProps> = ({questionId, option}) => {
    const {optionId, optionText} = option;
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const questionsAnswered = selector(selectQuestionsAnswers)
    const attemptId = selector(selectAttemptId);
    const testId = selector(selectTestId);
    const selectOption = async () => {
        if (!(questionId in questionsAnswered)) {
            dispatch(incrementAnswerCount());
        } 
        if (!(questionId in questionsAnswered) || questionsAnswered[questionId] !== optionId) {
            dispatch(updateQuestionAnswer({questionId: questionId, selectedOptionId: optionId}));
            await AttemptRequest.saveQuestionAttempt({body: {questionId: questionId, selectedOptionId: optionId}, attemptId: attemptId})
            localStorage.setItem(`answer-${testId}`, JSON.stringify(questionsAnswered));
        }
        
    }

    return (
        <Form.Check
            className="option"
            label={optionText} 
            name={`question-${questionId}`}
            type={'radio'} 
            id={`${optionId}`}
            style={{fontSize: 14}}
            onClick = {selectOption}
        />
    );
}

export default SingleOption;