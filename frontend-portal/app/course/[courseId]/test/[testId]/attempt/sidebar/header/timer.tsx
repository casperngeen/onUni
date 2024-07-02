import { useState, useEffect } from "react";
import './header.scss';

const minutes = (time: number) => {
    return Math.floor(time/60);
}

const seconds = (time: number) => {
    return time - Math.floor(time/60);
}

const Timer: React.FC<{time: number}> = ({time}) => {
    // stores the time in seconds
    const [timeLeft, setTimeLeft] = useState(time);

    useEffect(() => {
        if (timeLeft <= 0) {
          return;
        }
    
        // every second the timer will set
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => clearInterval(timerId); // Cleanup the interval on component unmount
      }, [timeLeft]);
      
    return (
        <div className="sidebar-test-title-text">{minutes(timeLeft)}:{seconds(timeLeft)}</div>
    )
}

export default Timer;