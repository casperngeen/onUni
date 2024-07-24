import { Form, FormProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import "../../utils/styles/components/form.scss";

const UniFormComp = <As extends React.ElementType = React.ElementType>(
  props: React.PropsWithChildren<
    ReplaceProps<As, BsPrefixProps<As> & FormProps>
  >,
) => {
  return <Form {...props} bsPrefix="uni-form"></Form>;
};

const UniForm = {
  Form: UniFormComp,
  ...{
    Group: Form.Group,
    Control: Form.Control,
    Floating: Form.Floating,
    Check: Form.Check,
    Switch: Form.Switch,
    Label: Form.Label,
    Text: Form.Text,
    Range: Form.Range,
    Select: Form.Select,
    FloatingLabel: Form.FloatingLabel,
  },
};

export default UniForm;
