"use client"

import { useState, useEffect } from "react";
import './header.scss';
import { useAppDispatch } from "@/utils/redux/utils/hooks";
import { submitAttempt } from "@/utils/redux/slicers/attempt.slicer";
import { useParams } from "next/navigation";

const Timer: React.FC<{minutes: number, seconds: number}> = ({minutes, seconds}) => {

    const [minutesLeft, setMinutesLeft] = useState(minutes);
    const [secondsLeft, setSecondsLeft] = useState(seconds);
    const dispatch = useAppDispatch()();

    const { attemptId: attemptIdString } = useParams();
    const attemptId = Array.isArray(attemptIdString) ? parseInt(attemptIdString[0]) : parseInt(attemptIdString);


    useEffect(() => {
        if (minutesLeft <= 0 && secondsLeft <= 0) {
          dispatch(submitAttempt({attemptId: attemptId}))
        }
    
        // every second the timer will set
        const timerId = setInterval(() => {
          if (secondsLeft == 0) {
            setSecondsLeft(59);
            setMinutesLeft((prev) => prev-1);
          } else {
            setSecondsLeft((prev) => prev-1);
          }
        }, 1000);
    
        return () => clearInterval(timerId); // Cleanup the interval on component unmount
      }, [attemptId, dispatch, minutesLeft, secondsLeft]);
    
    return (
        <div className="timer-time">{minutesLeft < 10 && 0}{minutesLeft}:{secondsLeft < 10 && 0}{secondsLeft}</div>
    )
}

export default Timer;