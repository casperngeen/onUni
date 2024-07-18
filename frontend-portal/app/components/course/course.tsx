import UniButton from '@/components/overwrite/uni.button'
import UniProgressBar from '@/components/overwrite/uni.progress'
import { AllCourseResponse } from '@/utils/request/types/course.types'
import { useRouter } from 'next/navigation'
import React from 'react'
import './course.scss'

interface ICourseDashboardDisplayProps {
    course: AllCourseResponse,
}

const CourseDashboardDisplay: React.FC<ICourseDashboardDisplayProps> = ({ course }) => {
    const { title, courseId, startDate, endDate, progress } = course;
    const router = useRouter();
    const startDateParts = startDate.split("/");
    const year = startDateParts[2];
    const month = startDateParts[1];
    const day = startDateParts[0];

    const viewCourse = () => {
        router.push(`/course/${courseId}`);
    }
    
    return (
        <div className='course-display-container'>
            <div className='course-display-title-container'>
                <div className='course-display-title'>
                    {title}
                </div>
            </div>
            <div className='course-display-info-with-progress'>
                <div className='progress-bar-container'>
                    <UniProgressBar customprogress='attempt' now={progress}/>
                    <div className='progress-bar-value'>
                        {progress}%
                    </div>
                </div>
                <div className='course-display-info-container'>
                    <div className='course-display-info'>
                        <div className='date-container'>
                            <div className='date-description'>
                                Start Date:
                            </div>
                            <div className='date-value'>
                                {startDate}
                            </div>
                        </div>
                        <div className='date-container'>
                            <div className='date-description'>
                                End Date:
                            </div>
                            <div className='date-value'>
                                {endDate}
                            </div>
                        </div>
                    </div>
                    <UniButton custombutton='view' onClick={viewCourse}>
                        {
                            Date.parse(`${year}-${month}-${day}`) > Date.now() || progress === 100
                            ? `View course`
                            : progress === 0
                            ? `Start`
                            : `Continue`
                        }
                    </UniButton>
                </div>
            </div>
        </div>
    )
}

export default CourseDashboardDisplay