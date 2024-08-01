"use client";

import UniModal from "@/components/overwrite/uni.modal";
import { useAppSelector } from "@/utils/redux/hooks";
import React from "react";
import { Image, Spinner } from "react-bootstrap";
import "./modal.scss";
import {
    SubmitStatus,
    selectSubmitStatus,
} from "@/utils/redux/slicers/attempt.slicer";

const SubmttingModal: React.FC<{}> = () => {
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
                <Spinner
                    animation="border"
                    variant="primary"
                    size="sm"
                ></Spinner>
                <div>Marking the test...</div>
            </div>
        </UniModal.Modal>
    );
};

export default SubmttingModal;
