'use client'

import UniProgressBar from "@/components/overwrite/uni.progress";
import { selectQuestions, selectQuestionsAnswers } from "@/utils/redux/slicers/attempt.slicer";
import { useAppSelector } from "@/utils/redux/utils/hooks";
import './progress.scss';

const SidebarProgressBar: React.FC<{}> = () => {
    const selector = useAppSelector();
    const questions = selector(selectQuestions);
    const answers = selector(selectQuestionsAnswers);
    const answerCount = Object.keys(answers).length;
    
    return (
        <div className="sidebar-header-bar">
            <div className="progress-bar-title">Progress</div>
            <div className="progress-bar-display">
                <UniProgressBar customprogress="attempt" now={answerCount/questions.length * 100}/>           
                <div className="progress-bar-count">
                    {answerCount < 10 && 0}{answerCount}/{questions.length < 10 && 0}{questions.length}
                </div>
            </div>
        </div>
    )
}

export default SidebarProgressBar;