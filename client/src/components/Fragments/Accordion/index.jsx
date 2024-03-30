import React, { createContext, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AccordionContext = createContext();

export const Accordion = ({ children, value, onChange, ...props }) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <ul {...props}>
      <AccordionContext.Provider value={{ selected, setSelected }}>{children}</AccordionContext.Provider>
    </ul>
  );
};

export const AccordionItem = ({ children, value, trigger, ...props }) => {
  const { selected, setSelected } = useContext(AccordionContext);
  const open = selected === value;

  return (
    <li className="">
      <div
        onClick={() => {
          setSelected(open ? null : value);
        }}
        className="flex gap-2 items-center cursor-pointer"
      >
        <i className={`fa-solid fa-angle-down transition-transform ${open && "rotate-180"}`}></i>
        <p title={trigger} className={`hover:underline truncate ${open && "underline"}`}>
          {trigger}
        </p>
      </div>
      <div className={`overflow-y-hidden flex flex-col gap-2 ${open && "mb-4 mt-2"}`} style={{ height: open ? "100%" : 0 }}>
        {children}
      </div>
    </li>
  );
};
