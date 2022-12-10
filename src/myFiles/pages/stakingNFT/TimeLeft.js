import React, { useEffect, useState } from "react";

const TimerComponent = ({ endDate }) => {
  const currentDate = new Date();
  const time = endDate.getTime();
  const diff = endDate.getTime() - currentDate.getTime();

  const [sec, setSec] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60)) / 1000) : 0
  );
  const [days, setDays] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60 * 60 * 24)) / 1000) : 0
  );
  const [min, setMin] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) : 0
  );
  const [hour, setHour] = useState(
    diff > 0 ? Math.floor((diff % (1000 * 60 * 60 * 60)) / (1000 * 60)) : 0
  );
  useEffect(() => {
    const myInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const diff = time - currentTime;
      if (!(sec || min || hour || days)) {
      } else if (diff <= 0) {
        setSec(0);
        setMin(0);
        setHour(0);
        setDays(0);
      } else {
        setSec(Math.floor((diff % (1000 * 60)) / 1000));
        setMin(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        setHour(Math.floor((diff % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60)));
        setDays(
          Math.floor(
            (diff % (1000 * 60 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24)
          )
        );
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [sec, min, hour, days]);

  return (
    <div>
      <h3>Time left: {`${days} D ${hour} H ${min} M ${sec} S`}</h3>
    </div>
  );
};

export default TimerComponent;