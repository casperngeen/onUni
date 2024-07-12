import React from 'react'
import './tests.scss';

const TestListContainer: React.FC<{}> = () => {
  return (
    <div className='test-list-container'>
      <div className='course-intro'>
        <div className='course-intro-title'>
          Module Introduction
        </div>
        <div className='course-intro-content'>
          <div className='course-intro-description'>
            course description
          </div>
          <div className='course-info'>
            <div className='date-wrapper'>
              <div className='date-description'>
                Course start date:
              </div>
              <div className='date-value'>

              </div>
            </div>
            <div className='date-wrapper'>
              <div className='date-description'>
                Course end date:
              </div>
              <div className='date-value'>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='test-list-with-header'>
        <div className='test-list-header'>
          <div className='test-list-title'>
          </div>
          <div className='header-test-number'>
          </div>
        </div>
        <div className='test-list'>
          {/* map over all the tests */}
        </div>
      </div>
    </div>
  )
}

export default TestListContainer