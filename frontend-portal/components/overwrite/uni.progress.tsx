import { ProgressBar, ProgressBarProps } from "react-bootstrap";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

type TProgressPros = React.PropsWithChildren<ReplaceProps<'div', BsPrefixProps<'div'> & ProgressBarProps>>;
type UniProgressProps = {
  customprogress?: 'type-1' | 'type-2' | 'type-3'
};
const UniProgressBarComp = (props: TProgressPros & UniProgressProps) => {
  if (props.customprogress == 'type-1') {
    return <ProgressBar {...props} className="uni-progress-type-1" ></ProgressBar >
  }
  if (props.customprogress == 'type-2') {
    return <ProgressBar {...props} className="uni-progress-type-2" ></ProgressBar >
  }
  if (props.customprogress == 'type-3') {
    return <ProgressBar {...props} className="uni-progress-type-3" ></ProgressBar >
  }
  return <ProgressBar {...props} ></ProgressBar>
};

const UniProgressBar = UniProgressBarComp;
export default UniProgressBar;