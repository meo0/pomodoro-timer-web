import {useState} from 'react';

export const Clock = () => {
  const [time,setTime] = useState('');



  const dateTime = new Date();

  const nextTime = dateTime.getHours() + ":" 

                    + dateTime.getMinutes() + ":" 

                    + dateTime.getSeconds();



  const changeTime = ()=>{

    setTime(nextTime);

  }



  setTimeout(changeTime,1000);



  return(

      <div>

        <p>{time}</p>

      </div>

  );
};