"use client";

import "../attempt.scss";
import UniButton from "@/components/overwrite/uni.button";
import {
    UniContainer,
    UniRow,
    UniCol,
} from "@/components/overwrite/uni.components";
import React from "react";
import SingleQuestion from "../question/question";
import SideBarButtons from "../sidebar/button/button";
import SidebarHeader from "../sidebar/header/header";
import SidebarQuestions from "../sidebar/question/sidebar.question";
import SummaryTitle from "../summary/summary";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import {
    selectQuestions,
    exitSummary,
} from "@/utils/redux/slicers/attempt.slicer";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const AttemptSummary: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const questions = selector(selectQuestions);
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString)
        ? parseInt(courseIdString[0])
        : parseInt(courseIdString);
    const testId = Array.isArray(testIdString)
        ? parseInt(testIdString[0])
        : parseInt(testIdString);
    const router = useRouter();

    const reAttempt = () => {
        dispatch(exitSummary());
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    };

    return (
        <UniContainer fluid className="attempt">
            <UniRow className="attempt-wrapper">
                <UniCol className="col-md-3 sidebar">
                    <SidebarHeader />
                    <SidebarQuestions />
                    <SideBarButtons />
                </UniCol>
                <UniCol className="col-md-9 questions">
                    <div className="header">
                        <SummaryTitle />
                        <UniButton
                            custombutton="exit"
                            style={{ width: 200 }}
                            onClick={reAttempt}
                        >
                            Re-attempt
                        </UniButton>
                    </div>
                    {questions.map((question, index) => (
                        <div
                            key={question.questionId}
                            id={`question-${index + 1}`}
                        >
                            <SingleQuestion
                                questionInfo={question}
                                questionNumber={index + 1}
                            ></SingleQuestion>
                        </div>
                    ))}
                </UniCol>
            </UniRow>
        </UniContainer>
    );
};

export default AttemptSummary;
