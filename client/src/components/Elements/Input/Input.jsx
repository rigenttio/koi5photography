import React from "react";

const Input = (props) => {
  const { type, placeholder, name, typeInput, value, onChange, onInput, readOnly, defaultValue } = props;
  return typeInput === "icon" ? (
    <input
      value={value}
      readOnly={readOnly}
      defaultValue={defaultValue}
      onInput={onInput}
      onChange={onChange}
      autoComplete="off"
      type={type}
      name={name}
      id={name}
      className="pl-14 text-dark text-sm font-light border-none appearance-none focus:outline-none w-full py-4 px-6 rounded-[10px] placeholder:opacity-70"
      placeholder={placeholder}
    />
  ) : (
    <input
      value={value}
      readOnly={readOnly}
      defaultValue={defaultValue}
      onInput={onInput}
      onChange={onChange}
      autoComplete="off"
      type={type}
      name={name}
      id={name}
      className="text-dark text-sm font-light border-none appearance-none focus:outline-none w-full py-4 px-6 rounded-[10px] placeholder:opacity-70"
      placeholder={placeholder}
    />
  );
};

export default Input;
