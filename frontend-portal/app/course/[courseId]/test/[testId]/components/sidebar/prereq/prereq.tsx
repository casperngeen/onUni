'use client'

import { Image } from 'react-bootstrap';
import './prereq.scss';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectTestTitle } from '@/utils/redux/slicers/test.slicer';

const PreReqTab: React.FC<{}> = () => {
    const selector = useAppSelector();
    const testTitle = selector(selectTestTitle);
    return (
        <div className="test-tab">
            <Image alt="exam-1"/>
            <div className='test-title'>
                {testTitle}
            </div>
        </div>
    )
}

export default PreReqTab;