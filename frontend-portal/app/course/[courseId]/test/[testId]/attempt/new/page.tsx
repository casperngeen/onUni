"use client"

import { useEffect, useState } from "react";
import { useAppSelector } from "@/utils/redux/hooks";
import './modal.scss';
import { useParams, useRouter } from "next/navigation";
import UniModal from "@/components/overwrite/uni.modal";
import { Image, Spinner } from "react-bootstrap";
import { AttemptRequest } from "@/utils/request/attempt.request";

const CreateAttempt: React.FC<{}> = () => {
    const [toggleModal, setToggleModal] = useState(false);
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);

    const router = useRouter();
    
    useEffect(() => {
        if (localStorage.getItem(`username`) === null) {
            router.push(`/login`);
        } else {
            setToggleModal(true)
            const createAttempt = async () => {
                const { attemptId } = await AttemptRequest.createNewAttempt({
                    testId: testId, 
                    courseId: courseId
                });
                router.push(`/course/${courseId}/test/${testId}/attempt/${attemptId}/new`);
            }

            createAttempt();
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <UniModal.Modal custommodal="loading" show={toggleModal} backdrop="static">
            <Image src='/submitting.png' alt='Submitting test' height={180} width={200} />
            <div className="description">
                <Spinner animation="border" variant="primary" size="sm"/>
                <div>Creating new test...</div>
            </div>
        </UniModal.Modal>
    );
}

export default CreateAttempt;