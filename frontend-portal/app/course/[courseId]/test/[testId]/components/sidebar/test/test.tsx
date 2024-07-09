import { Image } from 'react-bootstrap';
import './test.scss';

const TestTab: React.FC<{}> = () => {
    return (
        <div className="test-tab">
            <Image alt="exam-1"/>
            <div className='test-title'>
                test title ?
            </div>
        </div>
    )
}

export default TestTab;