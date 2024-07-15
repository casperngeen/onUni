import { useAppSelector } from '@/utils/redux/hooks'
import { selectCourseTitle, selectTests } from '@/utils/redux/slicers/course.slicer';
import React from 'react'
import { Image } from 'react-bootstrap'
import './header.scss';

const CourseSidebarHeader: React.FC<{}> = () => {
    const selector = useAppSelector();
    const courseTitle = selector(selectCourseTitle);
    const numTests = selector(selectTests).length;

    return (
        <div className='course-sidebar-header'>
            <div className='sidebar-logo'>
                <Image src='/graduation-cap 1.svg' alt='course-logo'/>
            </div>
            <div className='header-info'>
                <div className='header-course-title'>
                    {courseTitle}
                </div>
                <div className='header-num-tests'>
                    {numTests} tests
                </div>
            </div>
        </div>
    )
}

export default CourseSidebarHeader