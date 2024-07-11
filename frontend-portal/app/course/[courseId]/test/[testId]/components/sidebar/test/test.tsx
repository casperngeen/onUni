'use client'

import { Image } from 'react-bootstrap';
import './test.scss';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectTestTitle } from '@/utils/redux/slicers/test.slicer';

const TestTab: React.FC<{}> = () => {
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

export default TestTab;