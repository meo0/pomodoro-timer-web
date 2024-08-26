import { Switch } from '@headlessui/react';
import {useState, useRef, useEffect} from 'react';

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
    const [autoNext, setAutoNext] = useState(false);
    useEffect(() => {
        if (isActive){
            startTimeRef.current = new Date();
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const toTimef = (now - startTimeRef.current + duration);
                setTimef(toTimef);
                const elapsedTime = Math.floor(toTimef / 1000);
                setTime(elapsedTime);
                if (isWorking && (elapsedTime >= workTime * 60 || elapsedTime >= breakTime * 60) ){
                    setTime(0);
                    setDuration(0);
                    setIsWorking(!isWorking);
                    if (!autoNext) setIsActive(false);
                }
            }, 100);
        }else {
            clearInterval(intervalRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            //console.log('cleanup');
        }

    },[isActive, duration, isWorking, autoNext]);
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
        setIsWorking(!isWorking);
        if (!autoNext) setIsActive(false);
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
    const handleToggleAutoNext = () => {
        setAutoNext(!autoNext);
    }
    return (
        <div>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            >
                <div
                style={{
                    clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                />
            </div>
            <p>{isWorking ? displayTime(countDownTime(time, workTime)) : displayTime(countDownTime(time, breakTime))}</p>
            <p className='text-gray-800 box'>{isWorking ? "Work time" : "Break Time"}</p>
            <button onClick={handleStart} className={OperateButton}>Start</button>
            <button onClick={handlePause} className={OperateButton}>Pause</button>
            <button onClick={handleReset} className={OperateButton}>Reset</button>
            <div className="flex items-center">
            <p className='px-4'>Auto Start Next Tiemr </p>
            <Switch
                checked={autoNext}
                onChange={handleToggleAutoNext}
                className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                />
            </Switch>
            </div>
        </div>
    );
}

const OperateButton = 'm-1 p-1 bg-blue-300 text-black rounded-md hover:bg-blue-700 hover:text-white';