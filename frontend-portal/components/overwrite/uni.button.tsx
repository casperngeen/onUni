import { Button, ButtonProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import '../../utils/styles/components/button.scss';

type BButtonPros = React.PropsWithChildren<ReplaceProps<'button', BsPrefixProps<'button'> & ButtonProps>>;
type UniButtonProps = {
  custombutton?: 'confirm' | 'exit' | 'type-3' | 'type-4' | 'type-5'
};
const UniButton = (props: BButtonPros & UniButtonProps) => {
  if (props.custombutton == 'confirm') {
    return <Button {...props} bsPrefix="button-confirm" ></Button >
  }
  if (props.custombutton == 'exit') {
    return <Button {...props} bsPrefix="button-exit" ></Button >
  }
  if (props.custombutton == 'type-3') {
    return <Button {...props} className="uni-btn-type-3" ></Button >
  }
  if (props.custombutton == 'type-4') {
    return <Button {...props} className="uni-btn-type-4" ></Button >
  }
  if (props.custombutton == 'type-5') {
    return <Button {...props} className="uni-btn-type-5" ></Button >
  }

  return <Button {...props} ></Button >
}

export default UniButton;