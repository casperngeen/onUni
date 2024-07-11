'use client'

import { useParams } from "next/navigation";
import MainContent from "../main/main";
import SideBar from "../sidebar/sidebar";
import { useAppDispatch } from "@/utils/redux/utils/hooks";
import { fetchTestInfo } from "@/utils/redux/slicers/test.slicer";
import { useEffect } from "react";
import './content.scss';

const TestPageContent: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const dispatch = useAppDispatch()();

    useEffect(() => {
        dispatch(fetchTestInfo({
            courseId: courseId,
            testId: testId,
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="test-content">
            <SideBar />
            <MainContent />
        </div>
    )
}

export default TestPageContent;