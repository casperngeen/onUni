import React from 'react'
import './content.scss';
import CourseSidebar from '../sidebar/sidebar';
import CourseMainContent from '../main/main';

const CourseContent: React.FC<{}>= () => {
  return (
    <div className='course-content'>
        <CourseSidebar />
        <CourseMainContent />
    </div>
  )
}

export default CourseContent