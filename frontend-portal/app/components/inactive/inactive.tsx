import React from 'react'
import './inactive.scss'
import { useAppSelector } from '@/utils/redux/hooks'
import { selectInactiveCourses } from '@/utils/redux/slicers/dashboard.slicer'
import CourseDashboardDisplay from '../course/course'

const InactiveCourses: React.FC<{}> = () => {
  const selector = useAppSelector();
  const inactiveCourses = selector(selectInactiveCourses);

  return (
    <div className='inactive-courses-with-header'>
      <div className='inactive-courses-header'>
        Courses starting soon
      </div>
      <div className='inactive-courses-container'>
        {
          inactiveCourses.map((course) => (
            <CourseDashboardDisplay key={course.courseId} course={course}/>
          ))
        }
      </div>
    </div>
  )
}

export default InactiveCourses