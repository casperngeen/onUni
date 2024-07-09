import { Image } from "react-bootstrap";
import TestHistory from "./history/history";

const Display: React.FC<{}> = () => {
    return (
        <div className="display">
            <div className="header">
                {false && <Image alt="expand-1" />}
                <div className="test-title">test title</div>
            </div>
            <TestHistory />
        </div>
    )
}

export default Display;