"use client";

import { Image } from "react-bootstrap";
import ExamContentPage from "./exam/exam";
import PracticeContentPage from "./practice/practice";
import QuizContentPage from "./quiz/quiz";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import {
    selectTestTitle,
    selectTestType,
    selectViewSidebar,
    toggleSidebar,
} from "@/utils/redux/slicers/test.slicer";
import "./display.scss";
import { TestTypes } from "@/utils/request/types/test.types";
import { useContext } from "react";
import { AuthContext } from "@/components/auth";
import Skeleton from "react-loading-skeleton";

const TestDisplay: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const showExpand = !selector(selectViewSidebar);
    const testTitle = selector(selectTestTitle);
    const testType = selector(selectTestType);
    const isVerified = useContext(AuthContext);

    const expandSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <div className="test-display">
            <div className="test-header">
                {showExpand && (
                    <a onClick={expandSidebar}>
                        <Image
                            src="/expand 1.svg"
                            className="expand-icon"
                            alt="expand-1"
                        />
                    </a>
                )}
                <div className="test-title">
                    {isVerified ? testTitle : <Skeleton />}
                </div>
            </div>
            {isVerified ? (
                testType === TestTypes.QUIZ && <QuizContentPage />
            ) : (
                <Skeleton baseColor="black" />
            )}
            {isVerified ? (
                testType === TestTypes.PRACTICE && <PracticeContentPage />
            ) : (
                <Skeleton />
            )}
            {isVerified ? (
                testType === TestTypes.EXAM && <ExamContentPage />
            ) : (
                <Skeleton />
            )}
        </div>
    );
};

export default TestDisplay;
