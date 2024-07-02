import { selectBookmarked, selectQuestions, selectQuestionsAnswers } from "@/utils/redux/slicers/attempt.slicer";
import { useAppSelector } from "@/utils/redux/utils/hooks";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
import './sidebar.questions.scss'


const SidebarQuestions: React.FC<{}> = () => {
    const selector = useAppSelector();
    const questions = selector(selectQuestions);
    const bookmarked = selector(selectBookmarked);
    const questionAnswers = selector(selectQuestionsAnswers);
    
    return (
        <div className="sidebar-questions">
            {questions.map((question, index) => (
                <a key={question.questionId} href={`#question-${index+1}`} className="text-decoration-none">
                    {
                        question.questionId in questionAnswers
                        ? <div className="sidebar-single-question-attempted">
                            <div className="question-number-attempted">
                                {index < 9 && 0}{index+1}
                            </div>
                            {
                                bookmarked.includes(question.questionId)
                                ? <BookmarkFill size={16} color='#FFCD39'></BookmarkFill>
                                : <Bookmark size={16} color='#F8F9FA'></Bookmark>
                            }
                        </div>
                        : <div className="sidebar-single-question">
                            <div className="question-number">
                                {index < 9 && 0}{index+1}
                            </div>
                            {
                                bookmarked.includes(question.questionId)
                                ? <BookmarkFill size={16} color='#FFCD39'></BookmarkFill>
                                : <Bookmark size={16} color='#6C757D'></Bookmark>
                            }
                        </div>
                    }
                </a>
            ))}
        </div>
    )
}

export default SidebarQuestions;