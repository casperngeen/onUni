'use client'

import { useParams } from "next/navigation";
import MainContent from "../main/main";
import SideBar from "../sidebar/sidebar";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { fetchTestInfo, getAllTests, selectTestOrder, setCurrIndex } from "@/utils/redux/slicers/test.slicer";
import { useEffect } from "react";
import './content.scss';

const TestPageContent: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const testOrder = selector(selectTestOrder);

    useEffect(() => {
        const initialise = async () => {
            dispatch(fetchTestInfo({
                courseId: courseId,
                testId: testId,
            }))

            // only retrieve all tests the first time
            await dispatch(getAllTests({ courseId: courseId })).unwrap()
            dispatch(setCurrIndex(testId));
        }
        initialise();
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