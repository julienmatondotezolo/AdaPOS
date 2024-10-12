import React, { useState } from "react";

const TimeHeader = () => {
  const [time, setTime] = useState<string>();

  setInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 1000);

  return (
    <div
      className="flex items-center justify-between pl-3 pr-3 py-1 text-white "
      style={{
        backgroundColor: "#000000",
      }}
    >
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
