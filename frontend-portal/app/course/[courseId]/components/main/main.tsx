import React from 'react';
import './main.scss';

const CourseMainContent: React.FC<{}> = () => {
  return (
    <div className='course-main'>
        <CourseSummary />
        <TestList />
    </div>
  )
}

export default CourseMainContent;