'use client'

import React from 'react'
import TestHistory from '../history/history'
import { useAppSelector } from '@/utils/redux/utils/hooks'
import { selectAttemptHistory, selectMaxScore, selectTimeLimit } from '@/utils/redux/slicers/test.slicer';
import './practice.scss';

const PracticeContentPage: React.FC<{}> = () => {
    const selector = useAppSelector();
    const maxScore = selector(selectMaxScore);
    const attempts = selector(selectAttemptHistory);
    const timeLimit = selector(selectTimeLimit);
    return (
        <div className='practice-content'>
            <div className='info-panel'>
                <div className='score-panel'>
                    <div className='score-description'>
                        Highest score:
                    </div>
                    <div className='score-number'>
                        {attempts.length
                            ? `${attempts.
                                map(x => x.score as number).
                                reduce((x,y) => y > x ? y : x, 0)}/${maxScore}`
                            : `--`
                        }
                    </div>
                </div>
                <div className='other-info'>
                    <div className='panel-item'>
                        <div className='panel-title'>
                            Time limit:
                        </div>
                        <div className='panel-content'>
                            {timeLimit} minutes
                        </div>
                    </div>
                    <div className='panel-item'>
                        <div className='panel-title'>
                            Attempts allowed:
                        </div>
                        <div className='panel-content'>
                            Unlimited
                        </div>
                    </div>
                </div>
            </div>
            <div className='instructions'>
                <div className='instruction-title'>
                    Note:
                </div>
                <div className='instruction-info'>
                    <ul>
                        <li>Keep a stable connection throughout the test</li>
                        <li>The system will automatically record the results if you exit during the test</li>
                        <li>{`If there is a problem (loss of connection, power outage, etc.) 
                        that affects the test results, please notify the QLHT.`}</li>
                    </ul>
                </div>
            </div>
            <TestHistory />
        </div>
    )
}

export default PracticeContentPage