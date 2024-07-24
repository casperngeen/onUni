import React from "react";
import "./active.scss";
import { useAppSelector } from "@/utils/redux/hooks";
import { selectActiveCourses } from "@/utils/redux/slicers/dashboard.slicer";
import CourseDashboardDisplay from "../course/course";

const ActiveCourses: React.FC<{}> = () => {
  const selector = useAppSelector();
  const activeCourses = selector(selectActiveCourses);

  return (
    <div className="active-courses-with-header">
      <div className="active-courses-header">Active courses</div>
      <div className="active-courses-container">
        {activeCourses.map((course) => (
          <CourseDashboardDisplay key={course.courseId} course={course} />
        ))}
      </div>
    </div>
  );
};

export default ActiveCourses;
