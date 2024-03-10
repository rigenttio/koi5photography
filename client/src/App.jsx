import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { env } from "./lib/env";

function App() {
  const [count, setCount] = useState(0);
  // console.log(import.meta.env.VITE_API_BASE_URL);
  console.log(env("VITE_API_BASE_URL"));

  return (
    <>
      <p className="text-red-500">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
