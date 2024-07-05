"use client"

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { selectLoading } from "@/utils/redux/slicers/attempt.slicer";
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

    const selector = useAppSelector();
    const dispatch = useAppDispatch()();
    const router = useRouter();
    const [ attemptId, setAttemptId ] = useState(0);
    const loading = selector(selectLoading);

    
    useEffect(() => {
        setToggleModal(true)
        
        const createAttempt = async () => {
            const { attemptId } = await AttemptRequest.createNewAttempt({
                testId: testId, 
                courseId: courseId
            });
            setAttemptId(attemptId);
            router.push(`/course/${courseId}/test/${testId}/attempt/${attemptId}/new`);
        }

        createAttempt();
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