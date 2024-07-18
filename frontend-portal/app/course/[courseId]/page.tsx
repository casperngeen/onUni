'use client'

import React, { useEffect } from 'react';
import './course.scss';
import NavBar from '@/components/navbar';
import CourseContent from './components/content/content';
import { useAppSelector } from '@/utils/redux/hooks';
import { useRouter } from 'next/navigation';

const CoursePage: React.FC<{}> = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem(`username`) === null) {
      router.replace(`/login`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  return (
    <div className='course'>
        <NavBar />
        <CourseContent />
    </div>
  )
}

export default CoursePage;