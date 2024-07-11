import React from 'react';
import './test.scss';
import { Image } from 'react-bootstrap';

const SidebarTestTab: React.FC<{}> = () => {
  return (
    <div className='sidebar-test'>
        <div className='test-status'>
            {
                true
                ? <Image src='' alt='completed'/>
                : <Image src='' alt='uncompleted'/>
            }
        </div>
        <div className='sidebar-test-title'>
            Test title
            {/* if test is exam -> style thet title differently and add deadline */}
        </div>
    </div>
  )
}

export default SidebarTestTab