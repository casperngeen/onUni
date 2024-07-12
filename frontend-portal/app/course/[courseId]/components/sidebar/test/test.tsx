import React from 'react';
import './test.scss';
import { Image } from 'react-bootstrap';

const SidebarTestTab: React.FC<{}> = () => {
  return (
    <div className='sidebar-test'>
        <div className='test-status'>
            {
                true
                ? <Image src='' alt='exam'/>
                : true
                    ? <Image src='' alt='completed'/>
                    : <Image src='' alt='uncompleted'/>
            }
        </div>
        {true
            ? <div className='sidebar-exam-info'>
                <div className='sidebar-exam-title'>
                    Test title
                </div>
                <div className='sidebar-exam-deadline'>
                    Deadline
                </div>
            </div>
            : <div className='sidebar-test-title'>
                Test title
            </div>
        }
    </div>
  )
}

export default SidebarTestTab