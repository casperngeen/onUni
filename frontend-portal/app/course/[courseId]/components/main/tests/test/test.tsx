import UniButton from '@/components/overwrite/uni.button'
import { TestTypes } from '@/utils/request/types/test.types'
import React from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import './test.scss'

const SingleTest: React.FC<{}> = () => {
    if (TestTypes.EXAM) {
        return (
            <div className='single-test'>
                <div className='test-title-deadline-container'>
                    <div className='test-title-exam'>
                        Test title
                    </div>
                    <div className='test-deadline'>
                        Test deadline
                    </div>
                </div>
                <div className='test-info-container'>
                    <div className='test-info'>
                        <div className='test-info-item'>
                            <div className='item-description'>
                                No. of attempts
                            </div>
                            <div className='item-value'>
                                0/3
                            </div>
                        </div>
                        <div className='test-info-item'>
                            <div className='item-description'>
                                Current score:
                            </div>
                            <div className='item-value'>
                                -- or 10/20
                            </div>
                        </div>
                    </div>
                    {
                        true  // check if previous test has been attempted or not or if this is the first test
                        ? <UniButton custombutton='confirm'>Attempt</UniButton>
                        : <div>
                            <div className='not-eligible'>
                            </div>
                            <a href='redirect to test-page'>
                                <div className='test-detail-link'>
                                    <div className='test-detail'>
                                        See details
                                    </div>
                                    <ChevronRight size={16}/>
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
                <div className='test-title'>

                </div>
                <div className='test-status'>
                    {
                        TestTypes.QUIZ
                        ? <div className='quiz-status'>
                            Completed/Not completed
                        </div>
                        : <div className='test-info-item'>
                            <div className='item-description'>

                            </div>
                            <div className='item-value'>
                            </div>
                        </div>
                    }
                    {
                        true  // check if previous test has been attempted or not or if this is the first test
                        ? <UniButton custombutton='confirm'>Attempt</UniButton>
                        : <div>
                            <div className='not-eligible'>
                                Not eligible
                            </div>
                            <a href='redirect to test page'>
                                <div className='test-detail-link'>
                                    <div className='test-detail'>
                                        See details
                                    </div>
                                    <ChevronRight size={16}/>
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