'use client'

import { OptionInfo } from "@/utils/request/types/attempt.types";
import { updateQuestionAnswer, selectQuestionsAnswers, selectAnswers, SubmitStatus, selectSubmitStatus } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { AttemptRequest } from "@/utils/request/attempt.request";
import UniForm from "@/components/overwrite/uni.form";
import './option.scss';
import { useParams } from "next/navigation";

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
    const isSelected = questionsAnswered[questionId] === optionId;
    const answers = selector(selectAnswers);
    const isSubmitedSelected = questionId in answers && answers[questionId].optionId === optionId;

    const { attemptId: attemptIdString } = useParams();
    const attemptId = Array.isArray(attemptIdString) ? parseInt(attemptIdString[0]) : parseInt(attemptIdString);

    const selectOption = async () => {
        if (!(questionId in questionsAnswered) || questionsAnswered[questionId] !== optionId) {
            dispatch(updateQuestionAnswer({questionId: questionId, selectedOptionId: optionId}));
            await AttemptRequest.saveQuestionAttempt({body: {questionId: questionId, selectedOptionId: optionId}, attemptId: attemptId})
        }
    }
    
    return viewOnly
    ? (
        <UniForm.Check
            readOnly
            label={optionText} 
            name={`question-${questionId}`}
            type={'radio'} 
            id={`${optionId}`}
            checked = {isSubmitedSelected}
            className="option"
        />
    )
    : (
        <UniForm.Check
            label={optionText} 
            name={`question-${questionId}`}
            type='radio' 
            id={`${optionId}`}
            onChange = {selectOption}
            checked = {isSelected}
            className="option"
        />
    )
}

export default SingleOption;