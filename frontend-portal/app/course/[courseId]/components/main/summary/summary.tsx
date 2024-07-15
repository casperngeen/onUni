'use client'

import UniButton from '@/components/overwrite/uni.button'
import React from 'react'
import { Image } from 'react-bootstrap'
import './summary.scss';
import UniProgressBar from '@/components/overwrite/uni.progress';
import { useAppSelector } from '@/utils/redux/hooks';
import { selectCourseTitle, selectTests } from '@/utils/redux/slicers/course.slicer';
import { useParams, useRouter } from 'next/navigation';

const CourseSummary: React.FC<{}> = () => {
  const selector = useAppSelector();
  const courseTitle = selector(selectCourseTitle);
  const tests = selector(selectTests);
  const { courseId: courseIdString } = useParams();
  const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
  const router = useRouter();
  const nextTestIndex = tests.map((test) => test.currScore).indexOf(null)
  const nextTest = nextTestIndex === -1 ? tests[tests.length-1] : tests[nextTestIndex];
  const progress = nextTestIndex === -1 ? 100 : (nextTestIndex/tests.length) * 100;

  const clickView = () => {
    router.push(`/course/${courseId}/test/${nextTest.testId}`);
  }

  return (
    <div className='course-summary'>
      <div className='course-title'>
        {courseTitle}
      </div>
      <div className='course-stats'>
        <div className='next-test'>
          <div className='test-image'>
            <Image src='/next-test.svg' alt='test' />
          </div>
          <div className='summary-test-container'>
            <div className='summary-test-info'>
              <div className='summary-test-title'>
                {nextTest.testTitle}
              </div>
              <div className='summary-test-description'>
                {nextTest.testDescription}
              </div>
            </div>
            <UniButton custombutton='confirm' onClick={clickView}>View</UniButton>
          </div>
        </div>
        <div className='course-progress'>
          <div className='course-progress-description'>
            Completion Rate
          </div>
          <div className='course-progress-container'>
            <div className='course-progress-number-container'>
              <div className='course-progress-number'>
                {Math.round(progress)}
              </div>
              <div className='course-progress-percent'>
                %
              </div>
            </div>
            <UniProgressBar customprogress='attempt' now={progress}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseSummary