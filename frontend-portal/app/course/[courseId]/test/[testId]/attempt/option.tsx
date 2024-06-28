'use client'

import { OptionInfo } from "@/utils/request/types/attempt.types";
import Form from 'react-bootstrap/Form';
import { incrementAnswerCount, markQuestionAnswered, selectAnswerCount, selectQuestionsAnswered } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";

interface SingleOptionProps {
    questionId: number,
    option: OptionInfo,
}

const SingleOption: React.FC<SingleOptionProps> = ({questionId, option}) => {
    const {optionId, optionText} = option;
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const questionsAnswered = selector(selectQuestionsAnswered)
    const selectOption = () => {
        if (!questionsAnswered.includes(questionId)) {
            dispatch(markQuestionAnswered(questionId));
            dispatch(incrementAnswerCount());
        }
        // api request to update the selected question also
        // if already selected do not send new request
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