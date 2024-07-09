import { Image } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

const SideBarNav: React.FC<{}> = () => {
    const closeSidebar = () => {
        //toggle state
    }

    return (
        <div className="sidebar-nav">
            <div className="hide">
                <a onClick={closeSidebar}>
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
                        courseTitle
                    </div>
                </div>
                <div className="test-toggle">
                    <ChevronLeft size={20}/>
                    <div>
                        Test title
                    </div>
                    <ChevronRight size={20}/>
                </div>
            </div>
        </div>
    )
}

export default SideBarNav;