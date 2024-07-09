import { useParams } from "next/navigation";
import { useState } from "react";
import MainContent from "../main/main";
import SideBar from "../sidebar/sidebar";

const TestPageContent: React.FC<{}> = () => {
    const { courseId: courseIdString, testId: testIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString); 
    const [showSidebar, setShowSideBar] = useState(true);

    const toggleSidebar = () => {

    }

    return (
        <div className="test-content">
            {showSidebar && <SideBar />}
            <MainContent />
        </div>
    )
}

export default TestPageContent;