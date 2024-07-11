'use client'

import UniButton from "@/components/overwrite/uni.button";
import './start.scss';
import { useParams, useRouter } from "next/navigation";

const StartButton: React.FC<{}> = () => {    
    const router = useRouter();
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    
    const startTest = () => {
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    }

    return (
        <div className="start">
            <UniButton custombutton="confirm" onClick={startTest} style={{width: 120}}>Start</UniButton>
        </div>
    )
}

export default StartButton;