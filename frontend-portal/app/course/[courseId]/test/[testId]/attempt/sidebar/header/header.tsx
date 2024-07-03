import { useAppSelector } from "@/utils/redux/utils/hooks";
import './header.scss';
import { SubmitStatus, selectCourseTitle, selectSubmitStatus, selectTestTitle, selectTimeLimit } from "@/utils/redux/slicers/attempt.slicer";
import { Clock } from "react-bootstrap-icons";
import Timer from "./timer";

const SidebarHeader: React.FC<{}> = () => {
    const selector = useAppSelector();
    const testTitle = selector(selectTestTitle);
    const courseTitle = selector(selectCourseTitle);
    const timeLimit = selector(selectTimeLimit);
    const unsubmitted = selector(selectSubmitStatus) === SubmitStatus.UNSUBMITTED;

    return (
        <div className="sidebar-header-title">
            <div className="sidebar-course">
                <div className="sidebar-course-logo">logo</div>
                <div className="sidebar-course-title">
                    {courseTitle}
                </div>
            </div>
            <div className="sidebar-test-title">
                <div className="sidebar-test-title-text">
                    {testTitle}
                </div>
                {timeLimit && unsubmitted &&
                    <div className="mt-1 d-flex">
                        <Clock size={16}/>
                        <Timer time={timeLimit * 60}></Timer>
                    </div>
                }
            </div>
        </div>
    )
}

export default SidebarHeader;