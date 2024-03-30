import React, { useState } from "react";
import Input from "./Input";

const InputForm = (props) => {
  const { type, placeholder, name, image, onChange, value, onInput, readOnly, defaultValue } = props;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePass = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return type === "password" ? (
    <div className="w-full relative">
      <Input defaultValue={defaultValue} readOnly={readOnly} value={value} onInput={onInput} onChange={onChange} typeInput="icon" type={isPasswordVisible ? "text" : "password"} placeholder={placeholder} name={name} />
      <img src={image} alt="icon" className="absolute bottom-1/2 translate-y-1/2 left-4" />
      <div onClick={togglePass} className="py-[10px] w-10 text-dark text-center shadow-md bg-white cursor-pointer bottom-1/2 translate-y-1/2 rounded-xl right-6 absolute text-[10px] ">
        {isPasswordVisible ? "Hide" : "Show"}
      </div>
    </div>
  ) : (
    <div className="w-full relative">
      <Input defaultValue={defaultValue} readOnly={readOnly} value={value} onInput={onInput} onChange={onChange} typeInput="icon" type={type} placeholder={placeholder} name={name} />
      <img src={image} alt="icon" className="absolute bottom-1/2 translate-y-1/2 left-4" />
    </div>
  );
};

export default InputForm;
