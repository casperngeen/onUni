'use client'

import { Image } from "react-bootstrap";
import ExamContentPage from "./exam/exam";
import PracticeContentPage from "./practice/practice";
import QuizContentPage from "./quiz/quiz";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { selectTestTitle, selectTestType, selectViewSidebar, toggleSidebar } from "@/utils/redux/slicers/test.slicer";
import './display.scss';
import { TestTypes } from "@/utils/request/types/test.types";

const TestDisplay: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const showExpand = !selector(selectViewSidebar);
    const testTitle = selector(selectTestTitle);
    const testType = selector(selectTestType);
    
    const expandSidebar = () => {
        dispatch(toggleSidebar());
    }

    return (
        <div className="test-display">
            <div className="test-header">
                {showExpand &&
                <a onClick={expandSidebar}>
                    <Image src="/expand 1.svg" className="expand-icon" alt="expand-1" />
                </a>}
                <div className="test-title">{testTitle}</div>
            </div>
            {testType === TestTypes.QUIZ &&
                <QuizContentPage />
            }
            {testType === TestTypes.PRACTICE &&
                <PracticeContentPage />
            }
            {testType === TestTypes.EXAM &&
                <ExamContentPage />
            }
        </div>
    )
}

export default TestDisplay;