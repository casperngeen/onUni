'use client'

import React from 'react'
import TestHistory from '../history/history'
import { Image } from 'react-bootstrap'
import './quiz.scss';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectMaxScore, selectTestDescription, selectTestTitle } from '@/utils/redux/slicers/test.slicer';

const QuizContentPage: React.FC<{}> = () => {
    const selector = useAppSelector();
    const testTitle = selector(selectTestTitle);
    const maxScore = selector(selectMaxScore);
    const testDescription = selector(selectTestDescription);
    
    return (
        <div className='quiz-content'>
            <div className='quiz-info'>
                <div className='info-title'>
                    <div className='test-title'>
                        {testTitle}
                    </div>
                    <div className='test-questions'>
                        {maxScore} questions
                    </div>
                </div>
                <div className='test-description'>
                    {testDescription}
                </div>
                <Image className='image' alt='online-learning-1'/>
            </div>
            <TestHistory />
        </div>
    )
}

export default QuizContentPage