import React from 'react';
import './sidebar.scss';
import CourseSidebarHeader from './header/header';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectTests } from '@/utils/redux/slicers/course.slicer';
import SidebarTestTab from './test/test';

const CourseSidebar: React.FC<{}> = () => {
  const selector = useAppSelector();
  const tests = selector(selectTests);

  return (
    <div className='course-sidebar'>
        <CourseSidebarHeader />
        {tests.map((test, index) => (
          <SidebarTestTab key={index} test={test}/>
        ))}
    </div>
  )
}

export default CourseSidebar