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
import { useEffect } from "react";
import "./content.scss";

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

  useEffect(() => {
    const initialise = async () => {
      await dispatch(
        fetchTestInfo({
          courseId: courseId,
          testId: testId,
        }),
      );

      if (!errorCode) {
        await dispatch(getAllTests({ courseId: courseId }));
      }
    };
    initialise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (testOrder.includes(testId)) {
      console.log(testOrder);
      console.log("setting");
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
