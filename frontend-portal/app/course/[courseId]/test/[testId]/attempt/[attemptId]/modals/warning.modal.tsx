"use client";

import UniButton from "@/components/overwrite/uni.button";
import UniModal from "@/components/overwrite/uni.modal";
import {
    deleteAttempt,
    flipShowExit,
    flipShowSubmit,
    selectShowExit,
    selectShowSubmit,
    submitAttempt,
} from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import "./modal.scss";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export enum ModalType {
    EXIT = "exit",
    SUBMIT = "submit",
}

export interface IAttemptModalProps {
    type: ModalType;
}

const WarningModal: React.FC<IAttemptModalProps> = ({ type }) => {
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

    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const isExit = type === ModalType.EXIT;
    const showModal = isExit
        ? selector(selectShowExit)
        : selector(selectShowSubmit);
    const router = useRouter();
    const [disableButton, setDisableButton] = useState(false);

    const handleClose = () => {
        if (isExit) {
            dispatch(flipShowExit());
        } else {
            dispatch(flipShowSubmit());
        }
    };
    const handleSubmit = () => {
        console.log("remove");
        localStorage.removeItem(`bookmark-${attemptId}`);
        setDisableButton(true);

        if (isExit) {
            dispatch(flipShowExit());
            dispatch(deleteAttempt({ attemptId: attemptId }));
            router.push(`/course/${courseId}/test/${testId}`);
        } else {
            dispatch(flipShowSubmit());
            dispatch(submitAttempt({ attemptId: attemptId }));
        }
    };

    return (
        <UniModal.Modal
            custommodal="warning"
            show={showModal}
            backdrop="static"
        >
            <UniModal.Header>
                <div className="warning-icon">
                    <ExclamationTriangleFill
                        color="#FD7E14"
                        width={16}
                        height={14}
                    />
                </div>
                {isExit ? <div>Exit attempt</div> : <div>Submit attempt</div>}
            </UniModal.Header>
            <UniModal.Body>
                {isExit
                    ? "You have not submitted your assignment yet. Are you sure you want to exit?"
                    : "You still have unanswered questions. Are you sure you want to submit your assignment?"}
            </UniModal.Body>
            <UniModal.Footer>
                <UniButton
                    custombutton="exit"
                    style={{ width: 120, height: 40 }}
                    className="button-gap"
                    onClick={handleClose}
                    disabled={disableButton}
                >
                    Cancel
                </UniButton>
                <UniButton
                    custombutton="confirm"
                    style={{ width: 120, height: 40 }}
                    onClick={handleSubmit}
                    disabled={disableButton}
                >
                    Confirm
                </UniButton>
            </UniModal.Footer>
        </UniModal.Modal>
    );
};

export default WarningModal;
