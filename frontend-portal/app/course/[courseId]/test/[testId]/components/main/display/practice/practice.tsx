import React from 'react'
import TestHistory from '../history/history'

const PracticeContentPage: React.FC<{}> = () => {
  return (
    <div className='practice-content'>
        <div className='info-panel'>
            <div className='score-panel'>
                <div className='score-description'>

                </div>
                <div className='score-number'>

                </div>
            </div>
            <div className='other-info'>
                <div className='panel-item'>
                    <div className='panel-title'>

                    </div>
                    <div className='panel-content'>

                    </div>
                </div>
                <div className='panel-item'>
                    <div className='panel-title'>

                    </div>
                    <div className='panel-content'>

                    </div>
                </div>
            </div>
        </div>
        <div className='instructions'>
            <div className='instruction-title'>
                Note:
            </div>
            <div className='instruction-info'>
            </div>
        </div>
        <TestHistory />
    </div>
  )
}

export default PracticeContentPage