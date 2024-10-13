import React, { useState } from "react";

const TimeHeader = () => {
  const [time, setTime] = useState<string>();

  setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  return (
    <div className="flex items-center justify-between p-2 bg-black">
      <div>
        <small className="font-bold">Ada</small>
      </div>
      <div>
        <small className="font-medium">{time}</small>
      </div>
      <div></div>
    </div>
  );
};

export { TimeHeader };
