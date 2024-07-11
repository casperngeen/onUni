'use client'

import React from 'react'
import TestHistory from '../history/history'
import { Image } from 'react-bootstrap'
import { useAppSelector } from '@/utils/redux/utils/hooks'
import { selectAttemptHistory, selectDeadline, selectMaxAttempt, selectMaxScore, selectScoringFormat, selectStartTime, selectTimeLimit } from '@/utils/redux/slicers/test.slicer'
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
    const scores = selector(selectAttemptHistory).map((attempt) => attempt.score);
    const maxScore = selector(selectMaxScore);

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

    const renderCurrScore = () => {
        switch(scoringFormat) {
            case ScoringFormats.AVERAGE:
                let sum = 0;
                let numCompleted = 0;
                let isNull = true;
                for (const score of scores) {
                    if (score) {
                        isNull = false;
                        sum += score;
                        numCompleted++;
                    }
                }
                if (isNull) {
                    return `--`
                } else {
                    const score = sum/numCompleted;
                    return `${Math.round(score/100)*100}/${maxScore}`;
                }
            case ScoringFormats.HIGHEST:
                let highest = 0;
                let isNullHighest = true;
                for (const score of scores) {
                    if (score) {
                        isNullHighest = false;
                        highest = Math.max(score, highest);
                    }
                }
                if (isNullHighest) {
                    return `--`
                } else {
                    return `${highest}/${maxScore}`;
                }
            case ScoringFormats.LATEST:
                const latest = scores.findLast((score) => score !== null)
                if (latest) {
                    return `${latest}/${maxScore}`;
                } else {
                    return `--`;
                }
        }
    }

    return (
        <div className='exam-content'>
            <div className='info-panel-exam'>
                <div className='score-panel-exam'>
                    <div className='score'>
                        <div className='score-description'>Current score:</div>
                        <div className='score-number'>{renderCurrScore()}</div>
                    </div>
                    <Image src='/exam 2.svg' className="exam-score-image" alt='exam-2'/>
                </div>
                <div className='other-info-exam'>
                    <div className='info-row-exam'>
                        <div className='panel-item-exam'>
                            <div className='panel-title-exam'>
                                No. of attempts:
                            </div>
                            <div className='panel-content-exam'>
                                {numOfAttempts}/{maxAttempts}
                            </div>
                        </div>
                        <div className='panel-item-exam'>
                            <div className='panel-title-exam'>
                                Time limit:
                            </div>
                            <div className='panel-content-exam'>
                                {timeLimit} minutes
                            </div>
                        </div>
                    </div>
                    <div className='info-row-exam'>
                        <div className='panel-item-exam'>  
                            <div className='panel-title-exam'>
                                Scoring format:
                            </div>
                            <div className='panel-content-exam'>
                                {renderScoringFormat()}
                            </div>
                        </div>  
                        <div className='panel-item-exam'>  
                            <div className='panel-title-exam'>
                                Validity period:
                            </div>
                            <div className='panel-content-exam'>
                                {startDate} - <br/>{endDate}
                            </div>
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

export default ExamContentPage