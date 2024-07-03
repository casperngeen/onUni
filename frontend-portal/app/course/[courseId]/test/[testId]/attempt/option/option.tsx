'use client'

import { OptionInfo } from "@/utils/request/types/attempt.types";
import Form from 'react-bootstrap/Form';
import { updateQuestionAnswer, selectQuestionsAnswers, selectAttemptId, selectAnswers, SubmitStatus, selectSubmitStatus } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { AttemptRequest } from "@/utils/request/attempt.request";
import './option.scss';

interface SingleOptionProps {
    questionId: number,
    option: OptionInfo,
}

const SingleOption: React.FC<SingleOptionProps> = ({questionId, option}) => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const {optionId, optionText} = option;
    const viewOnly = selector(selectSubmitStatus) === SubmitStatus.SUCCESS;
    const questionsAnswered = selector(selectQuestionsAnswers)
    const isSelected = questionsAnswered[questionId] === optionId
    const attemptId = selector(selectAttemptId);
    const answers = selector(selectAnswers);
    const isSubmitedSelected = questionId in answers && answers[questionId].optionId === optionId;

    const selectOption = async () => {
        if (!(questionId in questionsAnswered) || questionsAnswered[questionId] !== optionId) {
            dispatch(updateQuestionAnswer({questionId: questionId, selectedOptionId: optionId}));
            await AttemptRequest.saveQuestionAttempt({body: {questionId: questionId, selectedOptionId: optionId}, attemptId: attemptId})
        }
    }
    
    return viewOnly
    ? (
        <Form.Check
            className="option"
            readOnly
            disabled
            label={optionText} 
            name={`question-${questionId}`}
            type={'radio'} 
            id={`${optionId}`}
            style={{fontSize: 14}}
            checked = {isSubmitedSelected}
        />
    )
    : (
        <Form.Check
            label={optionText} 
            name={`question-${questionId}`}
            type={'radio'} 
            id={`${optionId}`}
            style={{fontSize: 14}}
            onChange = {selectOption}
            checked = {isSelected}
        />
    )
}

export default SingleOption;