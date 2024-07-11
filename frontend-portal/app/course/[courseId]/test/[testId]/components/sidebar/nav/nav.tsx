'use client'

import { selectCourseTitle, selectTestTitle } from "@/utils/redux/slicers/test.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { Image } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const SideBarNav: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const courseTitle = selector(selectCourseTitle);
    const testTitle = selector(selectTestTitle);
    
    const toggleSidebar = () => {
        dispatch(toggleSidebar);
    }
    
    return (
        <div className="sidebar-nav">
            <div className="hide">
                <a onClick={toggleSidebar}>
                    <Image alt="collapse-1"/>
                </a>
                <div>Hide list</div>
            </div>
            <div className="nav-container">
                <div className="course-info">
                    <div className="course-logo">
                        <Image alt="graduation-hat"/>
                    </div>
                    <div className="course-title">
                        {courseTitle}
                    </div>
                </div>
                <div className="test-toggle">
                    <ChevronLeft size={20}/>
                    <div>
                        {testTitle}
                    </div>
                    <ChevronRight size={20}/>
                </div>
            </div>
        </div>
    )
}

export default SideBarNav;