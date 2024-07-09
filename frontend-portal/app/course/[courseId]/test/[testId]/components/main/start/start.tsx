import UniButton from "@/components/overwrite/uni.button";
import './start.scss';

const StartButton: React.FC<{}> = () => {
    return (
        <div className="start">
            <UniButton custombutton="confirm">Start</UniButton>
        </div>
    )
}

export default StartButton;