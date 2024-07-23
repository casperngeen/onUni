'use client'

import '../attempt.scss';
import { UniContainer, UniRow, UniCol } from '@/components/overwrite/uni.components';
import React from 'react'
import SingleQuestion from '../question/question';
import SideBarButtons from '../sidebar/button/button';
import SidebarHeader from '../sidebar/header/header';
import SidebarQuestions from '../sidebar/question/sidebar.question';
import { useAppSelector } from '@/utils/redux/hooks';
import { selectQuestions } from '@/utils/redux/slicers/attempt.slicer';
import SidebarProgressBar from '../sidebar/progress/progress.bar';
import SubmttingModal from '../modals/submitting.modal';
import WarningModal, { ModalType } from '../modals/warning.modal';

const AttemptInProgress: React.FC<{}> = () => {
    const selector = useAppSelector();
    const questions = selector(selectQuestions);
    
    return (
        <>
            <UniContainer className="attempt" fluid>
                <UniRow className="attempt-wrapper">
                    <UniCol className="col-md-3 sidebar">
                        <SidebarHeader />
                        <SidebarProgressBar />
                        <SidebarQuestions />
                        <SideBarButtons />
                    </UniCol>
                    <UniCol className="col-md-9 questions">
                        {questions.map((question, index) => (
                            <div key={question.questionId} id={`question-${index+1}`}>
                                <SingleQuestion questionInfo={question} questionNumber={index+1}></SingleQuestion>
                            </div>
                        ))}
                    </UniCol>
                </UniRow>
            </UniContainer>

            <WarningModal type={ModalType.EXIT} />
            <WarningModal type={ModalType.SUBMIT} />
            <SubmttingModal />
        </>
    );
}
export default AttemptInProgress