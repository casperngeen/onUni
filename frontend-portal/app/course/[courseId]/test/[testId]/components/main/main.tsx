import { Display } from "react-bootstrap-icons";
import StartButton from "./start/start";
import './main.scss'

const MainContent: React.FC<{}> = () => {
    return (
        <div className="main">
            <Display />
            <StartButton />
        </div>
    )
}

export default MainContent;