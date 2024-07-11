import React from 'react'
import { Image } from 'react-bootstrap'

const CourseSidebarHeader: React.FC<{}> = () => {
  return (
    <div className='course-sidebar-header'>
        <div className='sidebar-logo'>
            <Image src='/graduation-cap 1.svg' alt='course-logo'/>
        </div>
        <div className='header-info'>
            <div className='header-course-title'>
                Course title
            </div>
            <div className='header-num-tests'>
                num tests
            </div>
        </div>
    </div>
  )
}

export default CourseSidebarHeader