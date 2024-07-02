import UniProgressBar from "@/components/overwrite/uni.progress";
import { selectAnswerCount, selectQuestions } from "@/utils/redux/slicers/attempt.slicer";
import { useAppSelector } from "@/utils/redux/utils/hooks";
import './progress.scss';


const SidebarProgressBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const questions = selector(selectQuestions);
    const answerCount = selector(selectAnswerCount);
    
    return (
        <div className="sidebar-header-bar">
            <div className="progress-bar-title">Progress</div>
            <div className="d-flex align-items-center">
                <UniProgressBar customprogress="attempt" now={answerCount/questions.length * 100}/>           
                <div className="progress-bar-count">
                    {answerCount < 10 && 0}{answerCount}/{questions.length < 10 && 0}{questions.length}
                </div>
            </div>
        </div>
    )
}

export default SidebarProgressBar;