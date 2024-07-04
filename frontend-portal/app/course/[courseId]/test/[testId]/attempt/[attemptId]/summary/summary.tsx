import { selectQuestions, selectScore, selectTimeTaken } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { Alarm, CheckCircle } from "react-bootstrap-icons";

const SummaryTitle: React.FC<{}> = () => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const numOfQuestions = selector(selectQuestions).length;
    const score = selector(selectScore);
    const milliseconds = selector(selectTimeTaken);
    const minutes = Math.floor(milliseconds/(60* 1000))
    const seconds = Math.floor(milliseconds/1000) - minutes * 60;

    return (
        <div className="summary">
            <div className="summary-title">
                <div className="title">
                    <CheckCircle size={16}/>
                    <div>Score</div>
                </div>
                <div className="display">{score}/{numOfQuestions}</div>
            </div>
            <div className="summary-title">
                <div className="title">
                    <Alarm size={16} />
                    <div>Time taken</div>
                </div>
                <div className="display">{minutes}:{seconds}</div>
            </div>
        </div>
    )
}

export default SummaryTitle;