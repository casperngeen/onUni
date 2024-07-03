import { Alert, AlertProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import '../../utils/styles/components/alert.scss';

type AAlertProps = React.PropsWithChildren<ReplaceProps<'div', BsPrefixProps<'div'> & AlertProps>>;
type UniAlertProps = {
  customalert?: 'success' | 'error' | 'type-3'
};

const UniAlertComp = (props: AAlertProps & UniAlertProps) => {
  if (props.customalert == 'success') {
    return <Alert {...props} className="alert-success" ></Alert >
  }
  if (props.customalert == 'error') {
    return <Alert {...props} className="alert-error" ></Alert >
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