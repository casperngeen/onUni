'use client'

import { useAppSelector } from "@/utils/redux/hooks";
import './header.scss';
import { SubmitStatus, selectCourseTitle, selectSubmitStatus, selectTestTitle, selectTimeRemaining } from "@/utils/redux/slicers/attempt.slicer";
import { Clock } from "react-bootstrap-icons";
import Timer from "./timer";
import { Image } from "react-bootstrap";

const SidebarHeader: React.FC<{}> = () => {
    const selector = useAppSelector();
    const testTitle = selector(selectTestTitle);
    const courseTitle = selector(selectCourseTitle);
    const timeRemaining = selector(selectTimeRemaining);
    const unsubmitted = selector(selectSubmitStatus) === SubmitStatus.UNSUBMITTED;

    return (
        <div className="sidebar-header-title">
            <div className="sidebar-course">
                <div className="sidebar-course-logo">
                    <Image src='/graduation-cap 1.svg' alt='course-logo'/>
                </div>
                <div className="sidebar-course-title">
                    {courseTitle}
                </div>
            </div>
            <div className="sidebar-test-title">
                <div className="sidebar-test-title-text">
                    {testTitle}
                </div>
                {timeRemaining && unsubmitted &&
                    <div className="timer">
                        <Clock size={16}/>
                        <Timer 
                            minutes={Math.floor(timeRemaining/60)} 
                            seconds={timeRemaining - Math.floor(timeRemaining/60)*60} 
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default SidebarHeader;