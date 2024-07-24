"use client";

import {
  navigateBack,
  navigateForward,
  selectCourseTitle,
  selectCurrIndex,
  selectTestOrder,
  selectTestTitle,
  toggleSidebar,
} from "@/utils/redux/slicers/test.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { Image } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import "./nav.scss";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const SideBarNav: React.FC<{}> = () => {
  const dispatch = useAppDispatch()();
  const selector = useAppSelector();
  const courseTitle = selector(selectCourseTitle);
  const testTitle = selector(selectTestTitle);
  const currIndex = selector(selectCurrIndex);
  const testOrder = selector(selectTestOrder);
  const router = useRouter();

  const { courseId: courseIdString, testId: testIdString } = useParams();
  const courseId = Array.isArray(courseIdString)
    ? parseInt(courseIdString[0])
    : parseInt(courseIdString);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (testOrder.length !== 0) {
      const newTestId = testOrder[currIndex].testId;
      router.push(`/course/${courseId}/test/${newTestId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currIndex]);

  const closeSidebar = () => {
    dispatch(toggleSidebar());
  };

  const clickBack = () => {
    if (currIndex > 0) {
      dispatch(navigateBack());
    }
  };

  const clickForward = () => {
    if (currIndex < testOrder.length - 1) {
      dispatch(navigateForward());
    }
  };

  const backToCourse = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="sidebar-nav">
      <div className="hide">
        <a onClick={closeSidebar}>
          <Image
            src="/collapse 1.svg"
            className="collapse-icon"
            alt="collapse-1"
          />
        </a>
        <div>Hide list</div>
      </div>
      <div className="nav-container">
        <a onClick={backToCourse}>
          <div className="test-sidebar-course-info">
            <div className="test-sidebar-course-logo">
              <Image src="/graduation-cap 1.svg" alt="graduation-hat" />
            </div>
            <div className="test-sidebar-course-title">{courseTitle}</div>
          </div>
        </a>
        <div className="test-toggle">
          <a style={{ cursor: "pointer" }} onClick={clickBack}>
            <ChevronLeft size={20} />
          </a>
          <div className="test-description">{testTitle}</div>
          <a style={{ cursor: "pointer" }} onClick={clickForward}>
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideBarNav;
