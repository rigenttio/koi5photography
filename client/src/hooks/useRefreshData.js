import React, { useState } from "react";

export const useRefreshData = () => {
  const [trigger, setTrigger] = useState(false);
  const doTrigger = () => {
    setTrigger((prevTrigger) => !prevTrigger);
  };
  return { trigger, doTrigger };
};
