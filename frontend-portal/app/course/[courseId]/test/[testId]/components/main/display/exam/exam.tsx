import React from 'react'
import TestHistory from '../history/history'
import { Image } from 'react-bootstrap'

const ExamContentPage: React.FC<{}> = () => {
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
                            {}/{}
                        </div>
                    </div>
                    <div className='panel-item'>
                        <div className='panel-title'>
                            Time limit:
                        </div>
                        <div className='panel-content'>
                            {} minutes
                        </div>
                    </div>
                </div>
                <div className='info-row'>
                    <div className='panel-item'>  
                        <div className='panel-title'>
                            Scoring format:
                        </div>
                        <div className='panel-content'>
                            {}
                        </div>
                    </div>  
                    <div className='panel-item'>  
                        <div className='panel-title'>
                            Validity period:
                        </div>
                        <div className='panel-content'>
                            {} - {}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='instructions'>
            <div className='instruction-wrapper'>
                <div className='instruction-title'></div>
                <div className='instruction-info'></div>
            </div>
            <div className='instruction-wrapper'>
                <div className='instruction-title'></div>
                <div className='instruction-info'></div>
            </div>
        </div>
        <TestHistory />
    </div>
  )
}

export default ExamContentPage