import React from 'react';
import './test.scss';
import { Image } from 'react-bootstrap';
import { ITestResponseWithAttemptInfo, TestTypes } from '@/utils/request/types/test.types';
import { formatDateTime } from '@/utils/redux/utils/format.date';

interface ITestTabProps {
    test: ITestResponseWithAttemptInfo,
}

const SidebarTestTab: React.FC<ITestTabProps> = ({test}) => {
    const { currScore, testTitle, deadline, testType } = test;

    return (
        <div className='sidebar-test'>
            {
                testType === TestTypes.EXAM
                ? <Image src='/exam 1.svg' alt='exam'/>
                : currScore
                    ? <Image src='/completed.svg' alt='completed'/>
                    : <Image src='/uncompleted.svg' alt='uncompleted'/>
            }
            {testType === TestTypes.EXAM
                ? <div className='sidebar-exam-info'>
                    <div className='sidebar-exam-title'>
                        {testTitle}
                    </div>
                    <div className='sidebar-exam-deadline'>
                        Deadline: {formatDateTime(new Date(deadline as string))}
                    </div>
                </div>
                : <div className='sidebar-test-title'>
                    {testTitle}
                </div>
            }
        </div>
    )
}

export default SidebarTestTab