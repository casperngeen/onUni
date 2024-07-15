'use client'

import UniButton from "@/components/overwrite/uni.button";
import './start.scss';
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/redux/hooks";
import { selectCurrIndex, selectTestOrder } from "@/utils/redux/slicers/test.slicer";

const StartButton: React.FC<{}> = () => {    
    const router = useRouter();
    const selector = useAppSelector();
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const currIndex = selector(selectCurrIndex);
    const tests = selector(selectTestOrder);
    const disabled = currIndex !== 0 && !tests[currIndex-1].completed;

    const startTest = () => {
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    }

    const buttonStyle = disabled
        ? {
            opacity: 0.6,
            width: 120,
          }
        : {
            width: 120,
        }

    return (
        <div className="start">
            <UniButton 
                custombutton="confirm" 
                onClick={startTest} 
                style={buttonStyle}
                disabled={disabled}
            >Start</UniButton>
        </div>
    )
}

export default StartButton;