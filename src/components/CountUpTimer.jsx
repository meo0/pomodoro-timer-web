import {useState} from 'react';

export const CountUpTimer = () => {
    const [time,setTime] = useState(0);
    
    const changeTime = ()=>{
        setTime(time+1);
    }
    
    setTimeout(changeTime,1000);
    
    return(
        <div>
            <p>{time}</p>
        </div>
    );
}