import { Modal, ModalProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

type TModalPros = React.PropsWithChildren<ReplaceProps<'div', BsPrefixProps<'div'> & ModalProps>>;
type UniModalProps = {
  custommodal?: 'type-1' | 'type-2' | 'type-3'
};
const UniModalComp = (props: TModalPros & UniModalProps) => {
  if (props.custommodal == 'type-1') {
    return <Modal {...props} className="uni-modal-type-1" ></Modal >
  }
  if (props.custommodal == 'type-2') {
    return <Modal {...props} className="uni-modal-type-2" ></Modal >
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