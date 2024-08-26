/** @jsxImportSource @emotion/react */
import Switch from '@mui/material/Switch';
import {css} from '@emotion/react';
import {useState, useRef, useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import SettingsIcon from '@mui/icons-material/Settings';

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
    const [autoNext, setAutoNext] = useState(true);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (isActive){
            startTimeRef.current = new Date();
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const toTimef = (now - startTimeRef.current + duration);
                setTimef(toTimef);
                const elapsedTime = Math.floor(toTimef / 1000);
                setTime(elapsedTime);
                if (isWorking ? elapsedTime >= workTime * 60 : elapsedTime >= breakTime * 60){
                    setTimef(0);
                    setTime(0);
                    setDuration(0);
                    setIsWorking(!isWorking);
                    if (autoNext === false) setIsActive(false);
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
    const handleToggleStartPause = () => {
        if(!isActive){
            handleStart();
        } else {
            handlePause();
        }
    }
    const handleReset = () => {
        setIsActive(false);
        setTimef(0);
        setTime(0);
        setDuration(0);
    };
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
        setDuration(timef);
        setAutoNext(!autoNext);
    }
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const settingStyle = css`
            padding: 3px;
            background-color: gray;
            margin:1px 1px 1px auto;
            `;
    return (
        <div>
        <div css={css`display:flex;`}>
        <IconButton css={settingStyle} size='large' aria-label='setting'><SettingsIcon/></IconButton>
        </div>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
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
            <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl p-4'>Pomodoro Timer</h2>
            <p className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>{isWorking ? displayTime(countDownTime(time, workTime)) : displayTime(countDownTime(time, breakTime))}</p>
            <p className='text-gray-800 box'>{isWorking ? "Work time" : "Break Time"}</p>
            </div>
            <div className='text-center p-4'>
            <button onClick={handleToggleStartPause} className={OperateButton}>{isActive ? 'Pause' : 'Start'}</button>
            <button onClick={handleReset} className={OperateButton}>Reset</button>
            </div>
            <div className="flex items-center">
            <p className='px-4'>Auto Start Next Timer </p>
            <Switch checked={autoNext} onChange={handleToggleAutoNext} inputProps={{ 'aria-label': 'controlled' }}/>
            </div>
        </div>
        </div>
    );
}

const OperateButton = 'm-1 p-1 bg-blue-300 text-black rounded-md hover:bg-blue-700 hover:text-white font-bold';