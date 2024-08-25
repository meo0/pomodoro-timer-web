import './App.css';
import {useState} from 'react';
import {Clock} from './components/Clock';
import {CountUpTimer} from './components/CountUpTimer';
import {CountUpTimerMoreAc} from './components/CountUpTimerMoreAc';
import {PomodoroNormal} from './components/PomodoroNormal';

function App() {
  return (
    <div className='main'>
      <PomodoroNormal />
    </div>
  )
}

export default App;
