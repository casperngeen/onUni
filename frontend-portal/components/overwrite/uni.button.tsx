import { Button, ButtonProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

type BButtonPros = React.PropsWithChildren<ReplaceProps<'button', BsPrefixProps<'button'> & ButtonProps>>;
type UniButtonProps = {
  custombutton?: 'type-1' | 'type-2' | 'type-3' | 'type-4' | 'type-5'
};
const UniButtonComp = (props: BButtonPros & UniButtonProps) => {
  if (props.custombutton == 'type-1') {
    return <Button {...props} className="button_type-1" ></Button >
  }
  if (props.custombutton == 'type-2') {
    return <Button {...props} className="uni-btn-type-2" ></Button >
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

export default UniButtonComp;