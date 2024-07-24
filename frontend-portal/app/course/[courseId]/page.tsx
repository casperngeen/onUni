"use client";

import React from "react";
import "./course.scss";
import NavBar from "@/components/navbar";
import CourseContent from "./components/content/content";
import withAuth from "@/components/auth";

const CoursePage: React.FC<{}> = () => {
  return (
    <div className="course">
      <NavBar />
      <CourseContent />
    </div>
  );
};

const CoursePageWithAuth = withAuth(CoursePage);

export default CoursePageWithAuth;
