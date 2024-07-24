import ProgressBar, { ProgressBarProps } from "react-bootstrap/ProgressBar";
import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";
import "../../utils/styles/components/progress.scss";

type TProgressPros = React.PropsWithChildren<
  ReplaceProps<"div", BsPrefixProps<"div"> & ProgressBarProps>
>;
type UniProgressProps = {
  customprogress?: "attempt" | "type-2" | "type-3";
};
const UniProgressBarComp = (props: TProgressPros & UniProgressProps) => {
  if (props.customprogress == "attempt") {
    return (
      <ProgressBar {...props} className="uni-progress-attempt"></ProgressBar>
    );
  }
  if (props.customprogress == "type-2") {
    return (
      <ProgressBar {...props} className="uni-progress-type-2"></ProgressBar>
    );
  }
  if (props.customprogress == "type-3") {
    return (
      <ProgressBar {...props} className="uni-progress-type-3"></ProgressBar>
    );
  }
  return <ProgressBar {...props}></ProgressBar>;
};

const UniProgressBar = UniProgressBarComp;
export default UniProgressBar;
