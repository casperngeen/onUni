import React from 'react';
import './main.scss';
import CourseSummary from './summary/summary';
import TestListContainer from './tests/tests';

const CourseMainContent: React.FC<{}> = () => {
  return (
    <div className='course-main'>
        <CourseSummary />
        <TestListContainer />
    </div>
  )
}

export default CourseMainContent;