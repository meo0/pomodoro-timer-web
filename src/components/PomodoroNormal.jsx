/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import {css} from '@emotion/react';
import {useState, useRef, useEffect, forwardRef} from 'react';
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
import Slider from '@mui/material/Slider';
import useSound from 'use-sound';
import OoruriSound from '../sounds/オオルリのさえずり1_01.mp3'

import SettingsIcon from '@mui/icons-material/Settings';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { bgcolor, display, styled } from '@mui/system';

export const PomodoroNormal = () => {
    const [timef, setTimef] = useState(0);//seconds*1000
    const [time, setTime] = useState(0);//seconds
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);
    const [workTime, setWorkTime] = useState(25);//minutes
    const [breakTime, setBreakTime] = useState(5);//minutes
    const [lognBreakTime, setLognBreakTime] = useState(15);//minutes
    const [lognBreakInterval, setLognBreakInterval] = useState(4);//after n-1 break time 
    const [sycleCount, setSycleCount] = useState(0);
    const [isWorking, setIsWorking] = useState(true);
    const [autoNext, setAutoNext] = useState(true);
    const [open, setOpen] = useState(false);
    const [ooruriSound] = useSound(OoruriSound);
    useEffect(() => {
        if (isActive){
            startTimeRef.current = new Date();
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const toTimef = (now - startTimeRef.current + duration);
                setTimef(toTimef);
                const elapsedTime = Math.floor(toTimef / 1000);
                setTime(elapsedTime);
                if (isWorking ? elapsedTime >= workTime * 60 : (sycleCount >= lognBreakInterval - 1 ? elapsedTime >= lognBreakTime : elapsedTime >= breakTime * 60)){
                    setTimef(0);
                    setTime(0);
                    setDuration(0);
                    setIsWorking(!isWorking);
                    if (autoNext === false) setIsActive(false);
                    ooruriSound();
                    if(sycleCount >= lognBreakInterval - 1){
                      setSycleCount(0);
                    }else{
                      setSycleCount(sycleCount + 1);
                    }
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
    const progress = (time, span) => {
        return 100 - ((time / (span*60)) * 100);
    }
    const settingStyle = css`
            padding: 3px;
            margin:1px 1px 1px auto;
            &:hover {
                background-color: gray;
            }
            `;
    return (
        <Box sx={{bgcolor: '#84b9cb'}}>{/*heightは後々実装していく*/}
        <div css={css`display:flex; overflow: hidden;`}>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl p-4'>Pomodoro Timer</h2>
            <IconButton css={settingStyle} size='large' aria-label='setting' onClick={handleClickOpen}><SettingsIcon/></IconButton>
        </div>
        <div >
            <Box sx={{display:'flex', justifyContent:'center'}}>
            <Box sx={{position:'relative', display:'inline-flex',}}>
              <Box sx={{}}>
                <CircularProgress variant='determinate' value={isWorking ? progress(time, workTime) : (sycleCount>=lognBreakTime-1 ? progress(time, lognBreakTime) : progress(time, breakTime))} size={400} sx={{display:'flex', color:'#9685cc'}}/>
              </Box>
              <Box sx={{top:0, left:0, bottom:0, right:0, position:'absolute', display:'flex', alignContent:'center', justifyContent:'center', flexDirection:'column'}}>
                <Box sx={{display:'flex', justifyContent:'center'}}>
                  <Box>
                <Box sx={{fontSize:100, color:'text.secondary'}}>{isWorking ? displayTime(countDownTime(time, workTime)) : (sycleCount>=lognBreakTime-1 ? displayTime(countDownTime(time,lognBreakTime)) : displayTime(countDownTime(time, breakTime)))}</Box>
                <Box sx={{display:'flex', justifyContent:'center', fontWeight:'bold', fontSize:21}} className='text-gray-800 box'>{isWorking ? "Focus time" : (sycleCount=>lognBreakInterval-1?"long Break Time":"Break Time")}</Box></Box>
                </Box>
              </Box>
            </Box>
            </Box>
            <div className='text-center p-4'>
            <button onClick={handleToggleStartPause} className={OperateButton}>{isActive ? 'Pause' : 'Start'}</button>
            <button onClick={handleReset} className={OperateButton}>Reset</button>
            </div> 
            </div>
            <SettingDialog onClose={handleClose} autoNext={autoNext} toggleAutoNext={handleToggleAutoNext} open={open} workTime={workTime} setWorkTime={setWorkTime} breakTime={breakTime} setBreakTime={setBreakTime} lognBreakTime={lognBreakTime} setLognBreakTime={setLognBreakTime} lognBreakInterval={lognBreakInterval} setLognBreakInterval={setLognBreakInterval}/>
        </Box>
    );
}

const OperateButton = 'm-1 p-1 bg-blue-300 text-black rounded-md hover:bg-blue-700 hover:text-white font-bold';

SettingDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  autoNext: PropTypes.bool.isRequired,
  toggleAutoNext: PropTypes.func.isRequired,
  workTime: PropTypes.number.isRequired,
  setWorkTime: PropTypes.func.isRequired,
  breakTime: PropTypes.number.isRequired,
  setBreakTime: PropTypes.func.isRequired,
  lognBreakTime: PropTypes.number.isRequired,
  setLognBreakTime: PropTypes.func.isRequired,
  lognBreakInterval: PropTypes.number.isRequired,
  setLognBreakInterval: PropTypes.func.isRequired,
};
function SettingDialog(props) {
    const {onClose, autoNext, toggleAutoNext, open, workTime, setWorkTime, breakTime, setBreakTime, lognBreakTime, setLognBreakTime, lognBreakInterval, setLognBreakInterval} = props;
    const handleClose = () => {
        onClose(autoNext);
    }
    return (
        <Dialog onClose={handleClose} open={open} >
            <DialogTitle>Settings</DialogTitle>
            <Box className="flex items-center" sx={{}}>
            <div className='px-4'>Auto Start Next Timer </div>
            <Switch checked={autoNext} onChange={toggleAutoNext} inputProps={{ 'aria-label': 'controlled' }}/>
            </Box>
            <hr />
            <Box sx={{mx: 2}}>
                <p>Work Time</p>
                <NumberInput placeholder="Forcus Time" value={workTime} onChange={(event, val) => setWorkTime(val)} />
            </Box> 
            <Box sx={{my:1}}>
            <Box sx={{mx:2}}>
                <p>Break Time</p>
                <NumberInput placeholder="Break Time" value={breakTime} onChange={(event, val) => setBreakTime(val)} />
            </Box>
            <Box sx={{mx:2}}>
              <p>Long Break Time</p>
                <NumberInput placeholder="Long Break Time" value={lognBreakTime} onChange={(event, val) => setLognBreakTime(val)} />
            </Box>
            </Box>
            <Box sx={{mx:2}}>
              <p>Long Break interval: {lognBreakInterval}</p>
            <Slider
              aria-label="Long break interval"
              defaultValue={4}
              value={lognBreakInterval}
              onChange={(event, val) =>setLognBreakInterval(val)}
              min={2}
              max={10}
              valueLabelDisplay='auto'
              sx={{mx:-1}}
            />
            </Box>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
const NumberInput = forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});


const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }
  & .arrow {
    transform: translateY(-1px);
  }
`,
);
