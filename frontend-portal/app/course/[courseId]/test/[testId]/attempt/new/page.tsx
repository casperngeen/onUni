"use client"

import { useEffect, useState } from "react";
import { useAppSelector } from "@/utils/redux/hooks";
import './modal.scss';
import { useParams, useRouter } from "next/navigation";
import UniModal from "@/components/overwrite/uni.modal";
import { Image, Spinner } from "react-bootstrap";
import { AttemptRequest } from "@/utils/request/attempt.request";
import RequestError from "@/utils/request/request.error";

const CreateAttempt: React.FC<{}> = () => {
    const [toggleModal, setToggleModal] = useState(false);
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const [error, setError] = useState('');

    const router = useRouter();
    
    useEffect(() => {
        if (localStorage.getItem(`username`) === null) {
            router.replace(`/login`);
        } else {
            setToggleModal(true)
            const createAttempt = async () => {
                try {
                    const { attemptId } = await AttemptRequest.createNewAttempt({
                        testId: testId, 
                        courseId: courseId
                    });
                    router.replace(`/course/${courseId}/test/${testId}/attempt/${attemptId}/new`);
                } catch (error) {
                    if (error instanceof RequestError) {
                        setError(`Error: ${error.message}`)
                    }
                }
            }

            createAttempt();
        }
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