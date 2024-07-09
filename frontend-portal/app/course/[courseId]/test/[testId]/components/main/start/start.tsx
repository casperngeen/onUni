import UniButton from "@/components/overwrite/uni.button";
import './start.scss';

const StartButton: React.FC<{}> = () => {
    return (
        <div className="start">
            <UniButton custombutton="confirm" style={{width: 120}}>Start</UniButton>
        </div>
    )
}

export default StartButton;