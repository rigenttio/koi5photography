import React, { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [branchs, setBranchs] = useState();

  useEffect(() => {
    const getBranch = async () => {
      try {
        const response = await axiosInstance.get("/branch");
        setBranchs(response.data.data);
      } catch (error) {}
    };

    getBranch();
  }, []);

  return <AppContext.Provider value={{ branchs }}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
