'use client'

import React from 'react'
import TestHistory from '../history/history'
import { useAppSelector } from '@/utils/redux/hooks'
import { selectAttemptHistory, selectMaxScore, selectTimeLimit } from '@/utils/redux/slicers/test.slicer';
import './practice.scss';
import { Image } from 'react-bootstrap';

const PracticeContentPage: React.FC<{}> = () => {
    const selector = useAppSelector();
    const maxScore = selector(selectMaxScore);
    const attempts = selector(selectAttemptHistory).filter((attempt) => attempt.submitted);
    const timeLimit = selector(selectTimeLimit);
    return (
        <div className='practice-content'>
            <div className='info-panel-practice'>
                <div className='score-panel-practice'>
                    <div className='score-description-practice'>
                        Highest score:
                    </div>
                    <div className='score-number-practice'>
                        {attempts.length
                            ? `${attempts
                                .map(x => x.score as number)
                                .reduce((x,y) => y > x ? y : x, 0)}/${maxScore}`
                            : `--`
                        }
                    </div>
                    <div className='decoration'>
                        <Image src='/score-deco.svg' alt='score-deco'/>
                    </div>
                </div>
                <div className='other-info-practice'>
                    <div className='panel-item-practice'>
                        <div className='panel-title-practice'>
                            Time limit:
                        </div>
                        <div className='panel-content-practice'>
                            {timeLimit === 1
                                ? `1 minute`
                                : `${timeLimit} minutes`
                            } 
                        </div>
                    </div>
                    <div className='panel-item-practice'>
                        <div className='panel-title-practice'>
                            Attempts allowed:
                        </div>
                        <div className='panel-content-practice'>
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