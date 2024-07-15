'use client'

import SideBarNav from "./nav/nav";
import PreReqTab from "./prereq/prereq";
import './sidebar.scss';
import { selectCurrIndex, selectViewSidebar } from "@/utils/redux/slicers/test.slicer";
import { useAppSelector } from "@/utils/redux/hooks";

const SideBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const showSidebar = selector(selectViewSidebar);
    const currIndex = selector(selectCurrIndex);
    
    return (
        <div className={`sidebar ${showSidebar ? '' : 'collapse'}`}>
            <SideBarNav />
            {currIndex !== 0 && <PreReqTab />}
        </div>
    )
}

export default SideBar;