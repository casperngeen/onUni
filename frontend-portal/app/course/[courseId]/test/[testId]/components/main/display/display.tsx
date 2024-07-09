import { Image } from "react-bootstrap";
import ExamContentPage from "./exam/exam";
import PracticeContentPage from "./practice/practice";
import QuizContentPage from "./quiz/quiz";

const Display: React.FC<{}> = () => {
    const clickExpand = () => {
        // toggle sidebar state
    }
    return (
        <div className="display">
            <div className="header">
                {false && <a onClick={clickExpand}><Image alt="expand-1" /></a>}
                <div className="test-title">test title</div>
            </div>
            {true &&
                <QuizContentPage />
            }
            {false &&
                <PracticeContentPage />
            }
            {false &&
                <ExamContentPage />
            }
        </div>
    )
}

export default Display;