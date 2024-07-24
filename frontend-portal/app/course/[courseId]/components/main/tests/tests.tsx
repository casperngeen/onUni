import React, { useEffect } from "react";
import "./tests.scss";
import { useAppSelector } from "@/utils/redux/hooks";
import {
  selectCourseDescription,
  selectEndDate,
  selectStartDate,
  selectTests,
} from "@/utils/redux/slicers/course.slicer";
import SingleTest from "./test/test";

const TestListContainer: React.FC<{}> = () => {
  const selector = useAppSelector();
  const courseDescription = selector(selectCourseDescription);
  const courseStart = selector(selectStartDate);
  const courseEnd = selector(selectEndDate);
  const tests = selector(selectTests);

  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.replace("#", "");
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    handleScroll();
  }, []);

  return (
    <div className="test-list-container">
      <div className="course-intro">
        <div className="course-intro-title">Module Introduction</div>
        <div className="course-intro-content">
          <div className="course-intro-description">{courseDescription}</div>
          <div className="course-info">
            <div className="date-wrapper">
              <div className="date-description">Course start date:</div>
              <div className="date-value">{courseStart}</div>
            </div>
            <div className="date-wrapper">
              <div className="date-description">Course end date:</div>
              <div className="date-value">{courseEnd}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="test-list-with-header">
        <div className="test-list-header">
          <div className="test-list-title">Module content</div>
          <div className="header-test-number">{tests.length} tests</div>
        </div>
        <div className="test-list">
          {tests.map((test, index) => (
            <div key={test.testId} id={`test-${index + 1}`}>
              <SingleTest test={test} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestListContainer;
