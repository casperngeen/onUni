'use client'

import { selectAttemptHistory, selectMaxScore } from '@/utils/redux/slicers/test.slicer';
import { useAppSelector } from '@/utils/redux/hooks';
import { Status } from '@/utils/request/types/attempt.types';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Image } from 'react-bootstrap';
import './history.scss';

const TestHistory: React.FC<{}> = () => {
  const router = useRouter();
  const selector = useAppSelector();
  const { courseId: courseIdString, testId: testIdString } = useParams();
  const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
  const testId = Array.isArray(testIdString) ? parseInt(testIdString[0]) : parseInt(testIdString);
  const attempts = selector(selectAttemptHistory);
  const maxScore = selector(selectMaxScore);

  const clickReview = (attemptId: number) => {
    router.push(`/course/${courseId}/test/${testId}/attempt/${attemptId}`)
  }

  const clickContinue = (attemptId: number) => {
    router.push(`/course/${courseId}/test/${testId}/attempt/${attemptId}/new`)
  }

  const renderStatus = (status: Status) => {
    switch(status) {
      case Status.SUBMIT:
        return `Submitted`
      case Status.AUTOSUBMIT:
        return `Auto-submitted`
      case Status.CALCULATING:
        return `Calculating...`
      case Status.PROGRESS:
        return `In-progress`
    }
  }

  return (
    <div className='history'>
      <div className='title'>Test history:</div>
      <div className='history-display'>
        <div className='history-header'>
          <div className='number'>No.</div>
          <div className='time'>Time</div>
          <div className='score-header'>Score</div>
          <div className='status'>Status</div>
          <div className='link'></div>
        </div>
        {attempts.length == 0 && 
          <div className='no-attempts'>
            <div>
              <Image src='/no-content 1.svg' className='no-attempt-image' alt='no-content-1'/>
            </div>
            <div className='no-attempt-message'>Not attempted</div>
          </div>
        }
        {attempts.length > 0 && 
          attempts.map((attempt, index) => (
            <div key={index} className='history-row'>
              <div className='number-row'>{index+1}</div>
              <div className='time-row'>
                {attempt.submitted
                  ? attempt.submitted
                  : `In-progress`
                }
              </div>
              <div className='score-row'>
                {attempt.score != null
                  ? `${attempt.score}/${maxScore}`
                  : `--`
                }
              </div>
              <div className='status-row'>{renderStatus(attempt.status)}</div>
              <div className='link-row'>
              {attempt.status === Status.SUBMIT || attempt.status === Status.AUTOSUBMIT
                  ? <a onClick={(event) => {
                    event.preventDefault();
                    clickReview(attempt.attemptId);
                  }}>Review</a> 
                  : <a onClick={(event) => {
                    event.preventDefault();
                    clickContinue(attempt.attemptId);
                  }}>Continue</a>
              }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default TestHistory; 

