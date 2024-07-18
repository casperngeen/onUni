import UniButton from '@/components/overwrite/uni.button'
import { ITestResponseWithAttemptInfo, ScoringFormats, TestTypes } from '@/utils/request/types/test.types'
import React from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import './test.scss'
import { useAppSelector } from '@/utils/redux/hooks'
import { selectTests } from '@/utils/redux/slicers/course.slicer'
import { formatDateTime, renderScoringFormat } from '@/utils/format'
import { useParams, useRouter } from 'next/navigation'
import { selectCourseInactive } from '@/utils/redux/slicers/course.slicer'

interface ISingleTestProps {
    test: ITestResponseWithAttemptInfo,
    index: number
}

const SingleTest: React.FC<ISingleTestProps> = ({test, index}) => {
    const selector = useAppSelector();
    const tests = selector(selectTests);
    const courseInactive = selector(selectCourseInactive);
    const { testId, testTitle, numOfAttempts, 
        currScore, maxScore, scoringFormat, 
        maxAttempt, testType, start, 
        deadline } = test;
    const router = useRouter();
    const isEligible = courseInactive
        ? false
        : start 
            ? Date.parse(start) < Date.now() && (index === 0 || tests[index-1].numOfAttempts > 0)
            : index === 0 || tests[index-1].numOfAttempts > 0;
    const { courseId: courseIdString } = useParams();
    const courseId = Array.isArray(courseIdString) ? parseInt(courseIdString[0]) : parseInt(courseIdString);
    const clickLinkOrButton = () => {
        router.push(`/course/${courseId}/test/${testId}`);
    }

    if (testType === TestTypes.QUIZ) {
        return (
            <div className='single-test-quiz'>
                <div className='test-title'>
                    {testTitle}
                </div>
                <div className='quiz-status-with-button'>
                    <div className='quiz-status'>
                        {
                            numOfAttempts === 0
                            ? `Not completed`
                            : `Completed`
                        }
                    </div>            
                    {
                        isEligible
                        ? <UniButton custombutton='confirm' onClick={clickLinkOrButton}>Attempt</UniButton>
                        : <div className='not-eligible-container'>
                            <a onClick={clickLinkOrButton}>
                                <div className='test-detail-link'>
                                    <div className='test-detail'>
                                        See details
                                    </div>
                                    <ChevronRight color='#0D6EFD' size={16}/>
                                </div>     
                            </a>
                        </div>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className='single-test'>
                <div className='test-title-deadline-container'>
                    <div className='test-title'>
                        {testTitle}
                    </div>
                    <div className='test-deadline'>
                        {deadline && `Deadline: ${formatDateTime(new Date(deadline))}`}
                    </div>
                </div>
                <div className='test-info-container'>
                    {testType === TestTypes.EXAM
                    ? <div className='test-info'>
                        <div className='test-info-item'>
                            <div className='item-description'>
                                Scoring format:
                            </div>
                            <div className='item-value'>
                               {renderScoringFormat(scoringFormat as ScoringFormats)}
                            </div>
                        </div>
                        <div className='test-info-item'>
                            <div className='item-description'>
                                No. of attempts:
                            </div>
                            <div className='item-value'>
                                {numOfAttempts}/{maxAttempt}
                            </div>
                        </div>
                        <div className='test-info-item'>
                            <div className='item-description'>
                                Current score:
                            </div>
                            <div className='item-value'>
                                {
                                    currScore
                                    ? `${currScore}/${maxScore}`
                                    : `--`
                                }
                            </div>
                        </div>
                    </div>
                    : <div className='test-info-item'>
                        <div className='item-description'>
                            Highest score:
                        </div>
                        <div className='item-value'>
                            {
                                currScore
                                ? `${currScore}/${maxScore}`
                                : `--`
                            }
                        </div>
                    </div>
                    }
                    {
                        isEligible
                        ? <UniButton custombutton='confirm' onClick={clickLinkOrButton}>Attempt</UniButton>
                        : <div className='not-eligible-container'>
                            <a onClick={clickLinkOrButton}>
                                <div className='test-detail-link'>
                                    <div className='test-detail'>
                                        See details
                                    </div>
                                    <ChevronRight color='#0D6EFD' size={16}/>
                                </div>
                            </a>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default SingleTest