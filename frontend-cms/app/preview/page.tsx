"use client"

import React from 'react';
import SingleCourse from '../course/course'; // Adjust path as per your project

const SingleCoursePreview = () => {
  const title = 'Sample Course';
  const start = '2024-06-30';
  const end = '2024-07-15';

  return (
    <div>
      <SingleCourse title={title} start={start} end={end} courseId={1} />
    </div>
  );
};

export default SingleCoursePreview;