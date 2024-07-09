import React from 'react';
import { Image } from 'react-bootstrap';

const TestHistory: React.FC<{}> = () => {
  interface AttemptInfo {
    time: string,
    score: number | null,
    questions: number,
    status: string, //enum
  }
  const attempts: AttemptInfo[] = []

  return (
    <div className='history'>
      <div className='title'>Test history:</div>
      <div className='history-display'>
        <div className='history-header'>
          <div className='number'>No.</div>
          <div className='time'>Time</div>
          <div className='score'>Score</div>
          <div className='status'>Status</div>
          <div className='link'></div>
        </div>
      </div>
      {false && 
        <div className='no-attempts'>
          <Image className='image' alt='no-content-1'/>
          <div className='no-attempt-message'>Not attempted</div>
        </div>
      }
      {true && 
        attempts.map((attempt, index) => (
          <div key={index} className='history-row'>
            <div className='number-row'>{index+1}</div>
            <div className='time-row'>{attempt.time}</div>
            <div className='score-row'>
              {attempt.score
                ? `${attempt.score}/${attempt.questions}`
                : `--`
              }
            </div>
            <div className='status-row'>{attempt.status}</div>
            <div className='link-row'>
              <a></a>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default TestHistory; 

