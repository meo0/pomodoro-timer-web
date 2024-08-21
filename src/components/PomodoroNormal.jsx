import {useState, useRef, useEffect} from 'react';

export const PomodoroNormal = () => {
    const [time, setTime] = useState(0);
    const [timef, setTimef] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const workTime = 25;
    const breakTime = 5;
    const [isWorking, setIsWorking] = useState(true);
    useEffect(() => {
        if (isActive){
            startTimeRef.current = new Date();
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const toTimef = (now - startTimeRef.current + duration);
                setTimef(toTimef);
                const elapsedTime = Math.floor(toTimef / 1000);
                setTime(elapsedTime);
                if (isWorking && elapsedTime >= workTime * 60){
                    setIsWorking(false);
                    initSession();
                }
                if (!isWorking && elapsedTime >= breakTime * 60){
                    setIsWorking(true);
                    initSession();
                }
            }, 100);
        }else {
            clearInterval(intervalRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            console.log('cleanup');
        }

    },[isActive, duration, isWorking]);
   const handleStart = () => {
    if (!isActive){
        setIsActive(true);  
    }
    };
    const handlePause = () => {
        if (isActive){
            setDuration(timef);
            setIsActive(false);
        }
    };
    const handleReset = () => {
        setIsActive(false);
        setTime(0);
        setDuration(0);
    };
    const initSession = () => {
        setTime(0);
        setDuration(0);
    }
    return (
        <div>
            <p>{time}</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleReset}>Reset</button>
            <p>{isWorking ? "Work time" : "Break Time"}</p>
        </div>
    );
}