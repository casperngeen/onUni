"use client";

import React, { useContext, useEffect } from "react";
import "./content.scss";
import CourseSidebar from "../sidebar/sidebar";
import CourseMainContent from "../main/main";
import { useAppDispatch } from "@/utils/redux/hooks";
import { fetchCourseInfo } from "@/utils/redux/slicers/course.slicer";
import { useParams } from "next/navigation";
import { AuthContext } from "@/components/auth";

const CourseContent: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const { courseId: courseIdString } = useParams();
    const courseId = Array.isArray(courseIdString)
        ? parseInt(courseIdString[0])
        : parseInt(courseIdString);
    const isVerified = useContext(AuthContext);

    useEffect(() => {
        if (isVerified) {
            dispatch(fetchCourseInfo({ courseId: courseId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerified]);

    return (
        <div className="course-content">
            <CourseSidebar />
            <CourseMainContent />
        </div>
    );
};

export default CourseContent;
