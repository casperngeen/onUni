'use client'

import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { QuestionInfo } from "@/utils/request/types/attempt.types";
import SingleOption from "../option/option";
import Container from "react-bootstrap/Container";
import { bookmarkQuestion, selectBookmarked, selectQuestionsAnswers, selectTestId, unbookmarkQuestion } from "@/utils/redux/slicers/attempt.slicer";
import './question.scss';
import { Bookmark, BookmarkFill, Flag } from "react-bootstrap-icons";
import { useEffect } from "react";

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
    const clickBookmark = () => {
        if (isSelected) {
            dispatch(unbookmarkQuestion(questionId));
        } else {
            dispatch(bookmarkQuestion(questionId));
        }
    }

    useEffect(() => {
        localStorage.setItem(`bookmark-${testId}`, JSON.stringify(bookmarked));
    }, [testId, bookmarked]);

    useEffect(() => {
        localStorage.setItem(`answer-${testId}`, JSON.stringify(questionsAnswered));
    }, [questionsAnswered, testId]);

    return (
        <Container className="question">
            <div className="question-header">
                <div className="d-inline-flex position-relative">
                    <div className="question-number">Q{questionNumber}</div>
                    <a onClick={clickBookmark}>
                    {isSelected
                        ? <BookmarkFill size={16} className="bookmark-icon" color='#FFCD39' />
                        : <Bookmark size={16} className="bookmark-icon" color='#6c757d' />
                    }
                    </a>
                    <div className="bookmark">Bookmark</div>
                </div>
                <div className="d-flex">
                    <Flag size={16} className="flag-icon" color='#0D6EFD'></Flag>
                    <div className="report">Report</div>
                </div>
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
        </Container>
    );
}

export default SingleQuestion;