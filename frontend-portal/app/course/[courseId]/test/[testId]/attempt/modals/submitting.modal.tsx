'use client'

import UniModal from "@/components/overwrite/uni.modal";
import { useAppSelector } from "@/utils/redux/utils/hooks";
import React, { useEffect } from "react";
import { Image, Spinner } from "react-bootstrap";
import './modal.scss';
import { SubmitStatus, selectAttemptId, selectSubmitStatus } from "@/utils/redux/slicers/attempt.slicer";
import { useParams, useRouter } from "next/navigation";

const SubmttingModal: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    
    const router = useRouter();
    const selector = useAppSelector();
    const attemptId = selector(selectAttemptId);
    const submitting = selector(selectSubmitStatus);
    const show = submitting === SubmitStatus.SUBMITTING;

    useEffect(() => {
        if (submitting === SubmitStatus.SUCCESS) {
            router.push(`course/${courseId}/test/${testId}/attempt/${attemptId}`)
        }
    }, [attemptId, courseId, router, submitting, testId]);

    return (
        <UniModal.Modal custommodal="submitting" show={show} backdrop="static">
            <Image src='public/submitting.png' alt='Submitting test' height={180} width={200}></Image>
            {/* <div className="image-gap"></div> */}
            <div className="d-flex justify-content-center">
                <Spinner className="spinner"></Spinner>
                <div>Marking the test...</div>
            </div>
        </UniModal.Modal>
    )
}

export default SubmttingModal;