"use client";

import TestDisplay from "./display/display";
import StartButton from "./start/start";
import "./main.scss";

const MainContent: React.FC<{}> = () => {
    return (
        <div className="main">
            <TestDisplay />
            <StartButton />
        </div>
    );
};

export default MainContent;
