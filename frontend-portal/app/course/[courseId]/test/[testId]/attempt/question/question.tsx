'use client'

import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { AnswerStatus, QuestionInfo } from "@/utils/request/types/attempt.types";
import SingleOption from "../option/option";
import Container from "react-bootstrap/Container";
import { bookmarkQuestion, selectBookmarked, selectQuestionsAnswers, selectTestId, unbookmarkQuestion, selectAnswers, selectSubmitStatus, SubmitStatus } from "@/utils/redux/slicers/attempt.slicer";
import './question.scss';
import { Bookmark, BookmarkFill, CheckCircleFill, ExclamationCircleFill, Flag } from "react-bootstrap-icons";
import { useEffect } from "react";
import UniAlert from "@/components/overwrite/uni.alert";

interface SingleQuestionProps {
    questionInfo: QuestionInfo,
    questionNumber: number,
}

const SingleQuestion: React.FC<SingleQuestionProps> = ({questionInfo, questionNumber}) => {
    const { questionId, questionText, options } = questionInfo;
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const bookmarked = selector(selectBookmarked);
    const testId = selector(selectTestId);
    const questionsAnswered = selector(selectQuestionsAnswers);
    const isSelected = bookmarked.includes(questionId);
    const answers = selector(selectAnswers);
    const viewOnly = selector(selectSubmitStatus) === SubmitStatus.SUCCESS;
    const answerStatus = questionId in answers 
        ? answers[questionId].isCorrect
            ? AnswerStatus.CORRECT
            : AnswerStatus.INCORRECT
        : AnswerStatus.UNATTEMPTED; 

    useEffect(() => {
        localStorage.setItem(`bookmark-${testId}`, JSON.stringify(bookmarked));
    }, [testId, bookmarked]);

    useEffect(() => {
        localStorage.setItem(`answer-${testId}`, JSON.stringify(questionsAnswered));
    }, [questionsAnswered, testId]);

    const clickBookmark = () => {
        if (isSelected) {
            dispatch(unbookmarkQuestion(questionId));
        } else {
            dispatch(bookmarkQuestion(questionId));
        }
    }

    const reportQuestion = () => {
        // open modal?
    }

    return (
        <Container className="question">
            <div className="question-header">
                <div className="d-inline-flex position-relative">
                    <div className="question-number">Q{questionNumber}</div>
                    {!viewOnly && 
                        <a onClick={clickBookmark}>
                            {isSelected
                                ? <BookmarkFill size={16} className="bookmark-icon" color='#FFCD39' />
                                : <Bookmark size={16} className="bookmark-icon" color='#6C757D' />
                            }
                        </a>
                    }
                    <div className="bookmark">Bookmark</div>
                </div>
                <a className="report" onClick={reportQuestion}>
                    <Flag size={16} className="flag-icon" color='#0D6EFD'></Flag>
                    <div className="report-text">Report</div>
                </a>
            </div>
            <div className="question-content">
                <div className="question-text">{questionText}</div>
                <div>
                    {questionInfo.options.map((option, index) => (
                        <div key={option.optionId}>
                            <SingleOption questionId={questionId} option={option}/>
                            {index !== options.length-1 && <div className="option-gap" />}
                        </div>
                    ))}
                </div>
            </div>
            {viewOnly && answerStatus === AnswerStatus.CORRECT &&
                <div>
                    <UniAlert.Alert customalert="success">
                        <CheckCircleFill size={20} color="#0F5132"/>
                        <div>Correct!</div>
                    </UniAlert.Alert>
                </div>
            }
            {viewOnly && answerStatus !== AnswerStatus.CORRECT &&
                <div>
                    <UniAlert.Alert customalert="error">
                        <ExclamationCircleFill size={20} color="#B02A37"/>
                        {answerStatus === AnswerStatus.INCORRECT
                            ? <div>Incorrect. Try again!</div>
                            : <div>Not attempted.</div>
                        }
                    </UniAlert.Alert>
                </div>
            }
        </Container>
    );
}

export default SingleQuestion;