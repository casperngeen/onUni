import UniButton from "@/components/overwrite/uni.button";
import UniModal from "@/components/overwrite/uni.modal"
import { deleteAttempt, flipShowExit, flipShowSubmit, selectAttemptId, selectShowExit, selectShowSubmit, selectTestId, submitAttempt } from "@/utils/redux/slicers/attempt.slicer";
import { useAppDispatch, useAppSelector } from "@/utils/redux/utils/hooks";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import './modal.scss';

export enum ModalType {
    EXIT = "exit",
    SUBMIT = "submit",
}

export interface IAttemptModalProps {
    type: ModalType;
}

const WarningModal: React.FC<IAttemptModalProps> = ({type}) => {
    const dispatch = useAppDispatch()();
    const selector = useAppSelector();
    const isExit = type === ModalType.EXIT;
    const attemptId = selector(selectAttemptId);
    const testId = selector(selectTestId);
    const showModal = isExit ? selector(selectShowExit) : selector(selectShowSubmit);

    const handleClose = () => {
        if (isExit) {
            dispatch(flipShowExit());
        } else {
            dispatch(flipShowSubmit());
        }
    }
    const handleSubmit = () => {
        localStorage.removeItem(`answer-${testId}`);
        localStorage.removeItem(`bookmark-${testId}`);
        localStorage.removeItem(`attemptId`);
        
        if (isExit) {
            dispatch(flipShowExit());
            dispatch(deleteAttempt({attemptId: attemptId}));
        } else {
            dispatch(flipShowSubmit());
            dispatch(submitAttempt({attemptId: attemptId}));
        }
    }

    return (
        <UniModal.Modal custommodal="warning" show={showModal} backdrop="static">
            <UniModal.Header>
                <div className="warning-icon">
                    <ExclamationTriangleFill color="#FD7E14" width={16} height={14}/>
                </div>
                {isExit 
                    ? <div>Exit attempt</div>
                    : <div>Submit attempt</div>
                }
            </UniModal.Header>
            <UniModal.Body>
                {isExit
                    ? 'You have not submitted your assignment yet. Are you sure you want to exit?'
                    : 'You still have unanswered questions. Are you sure you want to submit your assignment?'
                }
            </UniModal.Body>
            <UniModal.Footer>
                <UniButton custombutton="exit" style={{width: 120}} className="button-gap" onClick={handleClose}>
                    Cancel
                </UniButton>
                <UniButton custombutton="confirm" style={{width: 120}} onClick={handleSubmit}>
                    Confirm
                </UniButton>
            </UniModal.Footer>
        </UniModal.Modal>
    )
}

export default WarningModal;