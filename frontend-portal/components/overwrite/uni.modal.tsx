import { Modal, ModalProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import '../../utils/styles/components/modal.scss'

type TModalPros = React.PropsWithChildren<ReplaceProps<'div', BsPrefixProps<'div'> & ModalProps>>;
type UniModalProps = {
  custommodal?: 'warning' | 'submitting' | 'type-3'
};
const UniModalComp = (props: TModalPros & UniModalProps) => {
  if (props.custommodal == 'warning') {
    return <Modal {...props} className="modal-warning" centered></Modal >
  }
  if (props.custommodal == 'submitting') {
    return <Modal {...props} className="modal-submitting" ></Modal >
  }
  if (props.custommodal == 'type-3') {
    return <Modal {...props} className="uni-modal-type-3" ></Modal >
  }
  return <Modal {...props} ></Modal>
}

const UniModal = {
  Modal: UniModalComp, ...{
    Body: Modal.Body,
    Header: Modal.Header,
    Title: Modal.Title,
    Footer: Modal.Footer,
    Dialog: Modal.Dialog,
    TRANSITION_DURATION: 300,
    BACKDROP_TRANSITION_DURATION: 150,
  }
};

export default UniModal;