"use client"

import TestAttempt from "../course/[courseId]/test/[testId]/attempt/page";

interface TestAttemptProps {
    title: string,

    attemptDetails: {
        attemptId: number,
        questions: QuestionInfo[]
    }
}

export interface QuestionInfo {
    questionId: number,
    questionText: string,
    options: OptionInfo[],
}

export interface OptionInfo {
    optionId: number,
    optionText: string,
}

// const TestAttempt: React.FC<TestAttemptProps> = ({title, attemptDetails}) => {
//     const { attemptId, questions } = attemptDetails;
//     const numOfQuestions = questions.length;

//     return (
//         <div>

//         </div>
//     );
// }

const testQuestionInfo: QuestionInfo = {
    questionId: 1,
    questionText: 'This is the question text',
    options: [{
        optionId: 1,
        optionText: 'This is option 1',
    }, {
        optionId: 2,
        optionText: 'This is option 2',
    }, {
        optionId: 3,
        optionText: 'This is option 3',
    }]
}

const Preview = () => {
    return (
        <div>
          <TestAttempt courseId={4} testId={4}></TestAttempt>
        </div>
      );
}

export default Preview;