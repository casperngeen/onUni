"use client";

import UniModal from "@/components/overwrite/uni.modal";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import React, { useEffect } from "react";
import { Image, Spinner } from "react-bootstrap";
import "./modal.scss";
import {
  SubmitStatus,
  getAttempt,
  selectSubmitStatus,
} from "@/utils/redux/slicers/attempt.slicer";
import { useParams, useRouter } from "next/navigation";

const SubmttingModal: React.FC<{}> = () => {
  const {
    courseId: courseIdString,
    testId: testIdString,
    attemptId: attemptIdString,
  } = useParams();
  const courseId = Array.isArray(courseIdString)
    ? parseInt(courseIdString[0])
    : parseInt(courseIdString);
  const testId = Array.isArray(testIdString)
    ? parseInt(testIdString[0])
    : parseInt(testIdString);
  const attemptId = Array.isArray(attemptIdString)
    ? parseInt(attemptIdString[0])
    : parseInt(attemptIdString);

  const router = useRouter();
  const selector = useAppSelector();
  const submitting = selector(selectSubmitStatus);
  const show = submitting === SubmitStatus.SUBMITTING;

  return (
    <UniModal.Modal custommodal="loading" show={show} backdrop="static">
      <Image
        src="/submitting.png"
        alt="Submitting test"
        height={180}
        width={200}
      ></Image>
      {/* <div className="image-gap"></div> */}
      <div className="description">
        <Spinner animation="border" variant="primary" size="sm"></Spinner>
        <div>Marking the test...</div>
      </div>
    </UniModal.Modal>
  );
};

export default SubmttingModal;
