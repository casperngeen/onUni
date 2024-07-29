"use client";

import SideBarNav from "./nav/nav";
import PreReqTab from "./prereq/prereq";
import "./sidebar.scss";
import {
    selectCurrIndex,
    selectViewSidebar,
} from "@/utils/redux/slicers/test.slicer";
import { useAppSelector } from "@/utils/redux/hooks";
import { useContext } from "react";
import { AuthContext } from "@/components/auth";
import Skeleton from "react-loading-skeleton";

const SideBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const showSidebar = selector(selectViewSidebar);
    const currIndex = selector(selectCurrIndex);
    const isVerified = useContext(AuthContext);

    return (
        <div className={`sidebar ${showSidebar ? "" : "collapse"}`}>
            <SideBarNav />
            {isVerified ? currIndex !== 0 && <PreReqTab /> : <Skeleton />}
        </div>
    );
};

export default SideBar;
