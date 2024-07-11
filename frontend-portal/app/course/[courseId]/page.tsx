import React from 'react';
import './course.scss';
import NavBar from '@/components/navbar';
import CourseContent from './components/content/content';

const CoursePage: React.FC<{}> = () => {
  return (
    <div className='course'>
        <NavBar />
        <CourseContent />
    </div>
  )
}

export default CoursePage;