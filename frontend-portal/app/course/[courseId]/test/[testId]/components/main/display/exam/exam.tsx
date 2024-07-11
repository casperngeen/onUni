'use client'

import React from 'react'
import TestHistory from '../history/history'
import { Image } from 'react-bootstrap'
import { useAppSelector } from '@/utils/redux/utils/hooks'
import { selectAttemptHistory, selectDeadline, selectMaxAttempt, selectScoringFormat, selectStartTime, selectTimeLimit } from '@/utils/redux/slicers/test.slicer'
import { ScoringFormats } from '@/utils/request/types/test.types'
import './exam.scss'

const ExamContentPage: React.FC<{}> = () => {
    const selector = useAppSelector();
    const maxAttempts = selector(selectMaxAttempt);
    const numOfAttempts = selector(selectAttemptHistory).length;
    const scoringFormat = selector(selectScoringFormat);
    const timeLimit = selector(selectTimeLimit);
    const startDate = selector(selectStartTime);
    const endDate = selector(selectDeadline);

    const renderScoringFormat = () => {
        switch(scoringFormat) {
            case ScoringFormats.AVERAGE:
                return 'Average score';
            case ScoringFormats.HIGHEST:
                return 'Highest score';
            case ScoringFormats.LATEST:
                return 'Latest score';
        }
    }

    return (
        <div className='exam-content'>
            <div className='info-panel'>
                <div className='score-panel'>
                    <div className='score'>
                        <div className='score-description'></div>
                        <div className='score-number'></div>
                    </div>
                    <Image className="image" alt='exam-2'/>
                </div>
                <div className='other-info'>
                    <div className='info-row'>
                        <div className='panel-item'>
                            <div className='panel-title'>
                                No. of attempts:
                            </div>
                            <div className='panel-content'>
                                {numOfAttempts}/{maxAttempts}
                            </div>
                        </div>
                        <div className='panel-item'>
                            <div className='panel-title'>
                                Time limit:
                            </div>
                            <div className='panel-content'>
                                {timeLimit} minutes
                            </div>
                        </div>
                    </div>
                    <div className='info-row'>
                        <div className='panel-item'>  
                            <div className='panel-title'>
                                Scoring format:
                            </div>
                            <div className='panel-content'>
                                {renderScoringFormat()}
                            </div>
                        </div>  
                        <div className='panel-item'>  
                            <div className='panel-title'>
                                Validity period:
                            </div>
                            <div className='panel-content'>
                                {startDate} - {endDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='instructions'>
                <div className='instruction-wrapper'>
                    <div className='instruction-title'></div>
                    <div className='instruction-info'></div>
                </div>
                <div className='instruction-wrapper'>
                    <div className='instruction-title'></div>
                    <div className='instruction-info'></div>
                </div>
            </div> */}
            <TestHistory />
        </div>
    )
}

export default ExamContentPage