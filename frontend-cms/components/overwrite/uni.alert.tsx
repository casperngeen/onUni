import { Alert, AlertProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

type AAlertProps = React.PropsWithChildren<ReplaceProps<'div', BsPrefixProps<'div'> & AlertProps>>;
type UniAlertProps = {
  customalert?: 'type-1' | 'type-2' | 'type-3'
};

const UniAlertComp = (props: AAlertProps & UniAlertProps) => {
  if (props.customalert == 'type-1') {
    return <Alert {...props} className="uni-alert-type-1" ></Alert >
  }
  if (props.customalert == 'type-2') {
    return <Alert {...props} className="uni-alert-type-2" ></Alert >
  }
  if (props.customalert == 'type-3') {
    return <Alert {...props} className="uni-alert-type-3" ></Alert >
  }

  return <Alert {...props} ></Alert>
}

const UniAlert = {
  Alert: UniAlertComp, ...{
    Link: Alert.Link,
    Heading: Alert.Heading
  }
};

export default UniAlert;