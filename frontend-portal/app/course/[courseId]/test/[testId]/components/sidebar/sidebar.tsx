'use client'

import SideBarNav from "./nav/nav";
import PreReqTab from "./prereq/prereq";
import './sidebar.scss';
import { selectViewSidebar } from "@/utils/redux/slicers/test.slicer";
import { useAppSelector } from "@/utils/redux/utils/hooks";

const SideBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const showSidebar = selector(selectViewSidebar);
    
    return (
        <div className={`sidebar ${showSidebar ? '' : 'collapse'}`}>
            <SideBarNav />
            <PreReqTab />
        </div>
    )
}

export default SideBar;