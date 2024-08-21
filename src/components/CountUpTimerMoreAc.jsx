import {useState, useRef, useEffect} from 'react';

export const CountUpTimerMoreAc = () => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (isActive){
            startTimeRef.current = new Date();
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const elapsedTime = Math.floor((now - startTimeRef.current + duration) / 1000);
                setTime(elapsedTime);
            }, 100);
        }else {
            clearInterval(intervalRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            console.log('cleanup');
        }

    },[isActive, duration]);
   const handleStart = () => {
    if (!isActive){
        setIsActive(true);  
    }
    };
    const handlePause = () => {
        const now = new Date();
        if (isActive){
            setDuration(value => value+(now-startTimeRef.current));
            setIsActive(false);
        }
    };
    const handleReset = () => {
        setIsActive(false);
        setTime(0);
        setDuration(0);
    };
    return (
        <div>
            <p>{time}</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleReset}>Reset</button>
            <p>{duration}</p>
        </div>
    );
}