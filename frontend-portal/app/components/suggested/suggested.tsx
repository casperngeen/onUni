"use client";

import React from "react";
import "./suggested.scss";
import UniButton from "@/components/overwrite/uni.button";
import { Image } from "react-bootstrap";
import { TestTypes } from "@/utils/request/types/test.types";
import { useAppSelector } from "@/utils/redux/hooks";
import { selectNextTest } from "@/utils/redux/slicers/dashboard.slicer";
import { useRouter } from "next/navigation";

const SuggestedTest: React.FC<{}> = () => {
  const selector = useAppSelector();
  const nextTest = selector(selectNextTest);
  const router = useRouter();

  const viewNextTest = () => {
    if (nextTest) {
      router.push(`/course/${nextTest.courseId}/test/${nextTest.testId}`);
    }
  };

  if (nextTest) {
    return (
      <div className="suggested-test-container">
        <div className="suggested-test-header">Recommended activity</div>
        <div className="suggested-test-description-container">
          {nextTest.testType === TestTypes.EXAM ? (
            <Image
              className="suggested-test-image"
              src="/next-exam.svg"
              alt="test"
            />
          ) : (
            <Image
              className="suggested-test-image"
              src="/next-test.svg"
              alt="test"
            />
          )}
          <div className="suggested-test-info">
            <div className="suggested-test-title-container">
              <div className="suggested-course-title">
                {nextTest.courseTitle}
              </div>
              <div className="suggested-test-title">{nextTest.testTitle}</div>
              <div className="suggested-test-type">
                {nextTest.testType === TestTypes.EXAM ? (
                  <Image src="/exam-logo-dashboard.svg" alt="exam" />
                ) : (
                  <Image src="/quiz-logo-dashboard.svg" alt="quiz" />
                )}
                {nextTest.testType === TestTypes.EXAM ? (
                  <div className="suggested-test-type-text">Exam</div>
                ) : nextTest.testType === TestTypes.PRACTICE ? (
                  <div className="suggested-test-type-text">Practice</div>
                ) : (
                  <div className="suggested-test-type-text">Quiz</div>
                )}
              </div>
            </div>
            <UniButton
              custombutton="confirm"
              style={{ width: "240px" }}
              onClick={viewNextTest}
            >
              Continue
            </UniButton>
          </div>
        </div>
      </div>
    );
  }
};

export default SuggestedTest;
