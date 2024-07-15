'use client'

import React, { useEffect } from 'react'
import './content.scss';
import CourseSidebar from '../sidebar/sidebar';
import CourseMainContent from '../main/main';
import { useAppDispatch } from '@/utils/redux/utils/hooks';
import { fetchCourseInfo } from '@/utils/redux/slicers/course.slicer';
import { useParams } from 'next/navigation';

const CourseContent: React.FC<{}>= () => {
  const dispatch = useAppDispatch()();
  const { courseId: courseIdString } = useParams();
  const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
  
  useEffect(() => {
    dispatch(fetchCourseInfo({courseId: courseId}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='course-content'>
        <CourseSidebar />
        <CourseMainContent />
    </div>
  )
}

export default CourseContent