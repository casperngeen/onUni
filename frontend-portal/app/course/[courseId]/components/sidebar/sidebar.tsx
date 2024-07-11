import React from 'react';
import './sidebar.scss';
import CourseSidebarHeader from './header/header';

const CourseSidebar: React.FC<{}> = () => {
  return (
    <div className='course-sidebar'>
        <CourseSidebarHeader />
        {/** map over all the tests in the course */}
    </div>
  )
}

export default CourseSidebar