import UniButton from '@/components/overwrite/uni.button'
import React from 'react'
import { Image } from 'react-bootstrap'
import './summary.scss';
import UniProgressBar from '@/components/overwrite/uni.progress';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectCourseTitle } from '@/utils/redux/slicers/course.slicer';

const CourseSummary: React.FC<{}> = () => {
  const selector = useAppSelector();
  const courseTitle = selector(selectCourseTitle);
  
  const clickAttempt = () => {

  }

  return (
    <div className='course-summary'>
      <div className='course-title'>
        Course title
      </div>
      <div className='course-stats'>
        <div className='next-test'>
          <div className='test-image'>
            <Image src='some url' alt='test' />
          </div>
          <div className='summary-test-container'>
            <div className='summary-test-info'>
              <div className='summary-test-title'>
                Test title
              </div>
              <div className='summary-test-description'>
                Test description
              </div>
            </div>
            <UniButton custombutton='confirm' onClick={clickAttempt}>Attempt</UniButton>
          </div>
        </div>
        <div className='course-progress'>
          <div className='course-progress-description'>
            Completion Rate
          </div>
          <div className='course-progress-container'>
            <div className='course-progress-number-container'>
              <div className='course-progress-number'>
                25 {/* number of tests completed out of all (rounded to nearest int) */}
              </div>
              <div className='course-progress-percent'>
                %
              </div>
            </div>
            <UniProgressBar customprogress='attempt' now={25}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseSummary