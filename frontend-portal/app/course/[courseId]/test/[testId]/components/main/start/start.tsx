'use client'

import UniButton from "@/components/overwrite/uni.button";
import './start.scss';
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/utils/redux/hooks";
import { selectCourseInactive, selectCurrIndex, selectTestOrder } from "@/utils/redux/slicers/test.slicer";

const StartButton: React.FC<{}> = () => {    
    const router = useRouter();
    const selector = useAppSelector();
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
    const currIndex = selector(selectCurrIndex);
    const tests = selector(selectTestOrder);
    const courseInactive = selector(selectCourseInactive);
    const disabled = courseInactive || (currIndex !== 0 && tests && !tests[currIndex-1].completed);

    const startTest = () => {
        router.push(`/course/${courseId}/test/${testId}/attempt/new`);
    }

    return (
        <div className="start">
            <UniButton 
                custombutton="confirm" 
                onClick={startTest} 
                style={{width: '120px'}}
                disabled={disabled}
            >Start</UniButton>
        </div>
    )
}

export default StartButton;