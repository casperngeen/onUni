import SideBarNav from "./nav/nav";
import TestTab from "./test/test";
import './sidebar.scss';

const SideBar: React.FC<{}> = () => {
    return (
        <div className="sidebar">
            <SideBarNav />
            <TestTab />
        </div>
    )
}

export default SideBar;