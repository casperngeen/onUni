"use client";

import { useParams } from "next/navigation";
import MainContent from "../main/main";
import SideBar from "../sidebar/sidebar";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import {
    fetchTestInfo,
    getAllTests,
    selectErrorCode,
    selectTestOrder,
    setCurrIndex,
} from "@/utils/redux/slicers/test.slicer";
import { useContext, useEffect } from "react";
import "./content.scss";
import { AuthContext } from "@/components/auth";

const TestPageContent: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString)
        ? parseInt(courseIdString[0])
        : parseInt(courseIdString);
    const testId = Array.isArray(testIdString)
        ? parseInt(testIdString[0])
        : parseInt(testIdString);
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const testOrder = selector(selectTestOrder).map((test) => test.testId);
    const errorCode = selector(selectErrorCode);
    const isVerified = useContext(AuthContext);

    useEffect(() => {
        const initialise = async () => {
            await dispatch(
                fetchTestInfo({
                    courseId: courseId,
                    testId: testId,
                })
            );

            if (!errorCode) {
                await dispatch(getAllTests({ courseId: courseId }));
            }
        };
        if (isVerified) {
            initialise();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerified]);

    useEffect(() => {
        if (testOrder.includes(testId)) {
            dispatch(setCurrIndex(testId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testOrder]);

    return (
        <div className="test-content">
            <SideBar />
            <MainContent />
        </div>
    );
};

export default TestPageContent;
