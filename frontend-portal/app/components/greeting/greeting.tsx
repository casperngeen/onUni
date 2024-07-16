import React from 'react'
import './greeting.scss'
import { Image } from 'react-bootstrap'

const Greeting: React.FC<{}> = () => {
  return (
    <div className='greeting'>
        <div className='greeting-container'>
            <div className='greeting-photo-wrapper'>
                <Image className='greeting-photo' src='/profile.svg' alt='profile'/>
            </div>
            <div className='greeting-text'>
                <div className='greeting-first-line'>
                    {
                        4 < new Date().getHours() && new Date().getHours() < 12
                        ? `Good morning,`
                        : 11 < new Date().getHours() && new Date().getHours() < 19
                            ? `Good afternoon,`
                            : `Good evening,`
                    }
                </div>
                <div className='greeting-second-line'>
                    Name
                </div>
            </div>
        </div>
    </div>
  )
}

export default Greeting