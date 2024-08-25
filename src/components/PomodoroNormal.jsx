import {useState, useRef, useEffect, Children} from 'react';

const mainStyle = {
    backgroundColor: 'lightblue'
}

export const PomodoroNormal = () => {
    const [timef, setTimef] = useState(0);//seconds*1000
    const [time, setTime] = useState(0);//seconds
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const workTime = 25;//minutes
    const breakTime = 5;//minutes
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
    const displayTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    const countDownTime = (time, span) => {
        const leftTime = span*60 - time;
        return leftTime;
    }
    return (
        <div style={mainStyle}>
            <p>{isWorking ? displayTime(countDownTime(time, workTime)) : displayTime(countDownTime(time, breakTime))}</p>
            <p className='text-gray-800 box'>{isWorking ? "Work time" : "Break Time"}</p>
            <button onClick={handleStart} className={OperateButtonStyle}>Start</button>
            <button onClick={handlePause} className={OperateButtonStyle}>Pause</button>
            <button onClick={handleReset} className={OperateButtonStyle}>Reset</button>
        </div>
    );
}

const OperateButtonStyle = 'm-1 p-1 bg-blue-300 text-black rounded-md hover:bg-blue-700 hover:text-white';