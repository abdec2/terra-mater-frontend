import React, { useEffect, useState } from "react";

const StakeTimerComponent = () => {
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

 const startDate = year + month  + day;
  const startDate1 = new Date(parseInt(startDate)*1000)
  const currentDate = new Date();
  // console.log(currentDate);
  // console.log(endDate);
  const time = new Date(startDate1).getTime();
  const diff = currentDate.getTime() - time;

  const [sec, setSec] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60)) / 1000) : 0
  );
  const [min, setMin] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 3600)) / (1000 * 60)) : 0
  );
  const [hour, setHour] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 3600)) : 0
  );
  const [days, setDays] = useState(
    diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0
  );
  useEffect(() => {
    const myInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const diff = currentTime - time;
      setSec(Math.floor((diff % (1000 * 60)) / 1000));
      setMin(Math.floor((diff % (1000 * 3600)) / (1000 * 60)));
      setHour(Math.floor((diff % (1000 * 3600 * 24)) / (1000 * 60 * 60)));
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [sec, min, hour, days]);

  return (
    <div className="timer">
        <p>
            {days} D {hour} H {min} M {sec} S
        </p>
    </div>
  );
};

export default StakeTimerComponent