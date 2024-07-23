"use client"

import { useEffect, useState } from "react";
import './modal.scss';
import { useParams, useRouter } from "next/navigation";
import UniModal from "@/components/overwrite/uni.modal";
import { Image, Spinner } from "react-bootstrap";
import { AttemptRequest } from "@/utils/request/attempt.request";
import RequestError from "@/utils/request/request.error";
import { useAppDispatch } from "@/utils/redux/hooks";
import { resetState, setSubmitStatus, SubmitStatus } from "@/utils/redux/slicers/attempt.slicer";

const CreateAttempt: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const [toggleModal, setToggleModal] = useState(false);
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const [error, setError] = useState('');

    const router = useRouter();
    
    useEffect(() => {
        setToggleModal(true)
        dispatch(resetState());
        const createAttempt = async () => {
            try {
                const { attemptId } = await AttemptRequest.createNewAttempt({
                    testId: testId, 
                    courseId: courseId
                });
                router.replace(`/course/${courseId}/test/${testId}/attempt/${attemptId}`);
            } catch (error) {
                if (error instanceof RequestError) {
                    setError(`Error: ${error.message}`);
                }
            }
        }

        createAttempt();
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <UniModal.Modal custommodal="loading" show={toggleModal} backdrop="static">
            <Image src='/submitting.png' alt='Submitting test' height={180} width={200} />
            {error === ''
            ? <div className="description">
                <Spinner animation="border" variant="primary" size="sm"/>
                <div>Creating new test...</div>
            </div>
            : <div className="description">
                <div className="error">{error}</div>
            </div>
            }
        </UniModal.Modal>
    );
}

export default CreateAttempt;