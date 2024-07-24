"use client";

import { Image } from "react-bootstrap";
import "./prereq.scss";
import { useAppSelector } from "@/utils/redux/hooks";
import {
  selectCurrIndex,
  selectTestOrder,
  selectTestTitle,
} from "@/utils/redux/slicers/test.slicer";

const PreReqTab: React.FC<{}> = () => {
  const selector = useAppSelector();
  const currIndex = selector(selectCurrIndex);
  const prevTest = selector(selectTestOrder)[currIndex - 1];

  if (prevTest && prevTest.completed) {
    return (
      <div className="prereq-fulfilled">
        <Image src="/completed.svg" alt="completed" />
        <div className="prereq-test-title">Complete {prevTest.title}</div>
      </div>
    );
  } else if (prevTest) {
    return (
      <div className="prereq-unfulfilled">
        <Image src="/uncompleted.svg" alt="uncompleted" />
        <div className="prereq-test-title">Complete {prevTest.title}</div>
      </div>
    );
  }
};

export default PreReqTab;
