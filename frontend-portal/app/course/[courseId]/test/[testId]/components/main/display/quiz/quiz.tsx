import React from 'react'
import TestHistory from '../history/history'
import { Image } from 'react-bootstrap'
import './quiz.scss';

const QuizContentPage: React.FC<{}> = () => {
  return (
    <div className='quiz-content'>
        <div className='quiz-info'>
            <div className='info-title'>
                <div className='test-title'>
                    test title
                </div>
                <div className='test-questions'>
                    No. of questions
                </div>
            </div>
            <div className='test-description'>
                Test description
            </div>
            <Image className='image' alt='online-learning-1'/>
        </div>
        <TestHistory />
    </div>
  )
}

export default QuizContentPage