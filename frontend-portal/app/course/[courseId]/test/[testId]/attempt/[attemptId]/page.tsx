"use client";

import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import {
    SubmitStatus,
    getAttempt,
    selectSubmitStatus,
} from "@/utils/redux/slicers/attempt.slicer";
import AttemptSummary from "./components/summary";
import AttemptInProgress from "./components/in-progress";
import withAuth, { AuthContext } from "@/components/auth";

const AttemptPage: React.FC<{}> = () => {
    const { attemptId: attemptIdString } = useParams();
    const attemptId = Array.isArray(attemptIdString)
        ? parseInt(attemptIdString[0])
        : parseInt(attemptIdString);

    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const submitStatus = selector(selectSubmitStatus);
    const isVerified = useContext(AuthContext);

    useEffect(() => {
        if (isVerified) {
            dispatch(getAttempt({ attemptId: attemptId }));
        }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId, submitStatus, isVerified]);

    if (submitStatus === SubmitStatus.SUCCESS) {
        return <AttemptSummary />;
    } else if (submitStatus === SubmitStatus.UNSUBMITTED) {
        return <AttemptInProgress />;
    }
};

const AttemptWithAuth = withAuth(AttemptPage);

export default AttemptWithAuth;
