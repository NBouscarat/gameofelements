"use client";
import { useState, forwardRef, useImperativeHandle } from "react";

interface InputComponentProps {
    label:string;
    type:"number"|"text"|"email"|"password"|"tel"|"url"|"date";
    value?: string|number;
     // Valeur initiale (optionnelle)
}

interface InputComponentRef {
    GetValue: () => string | number;
}

const InputComponent = forwardRef<InputComponentRef, InputComponentProps>(({ label, value, type = "text" }, ref) => {
    const [inputValue, setInputValue] = useState(value || "");
  
    // Expose the current value to the parent via the ref
    useImperativeHandle(ref, () => ({
      GetValue: () => inputValue,
    }));

  return (
    <>
      <label htmlFor="simple-input">{label}</label>
      <input
        id="simple-input"
        type={type}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="..."
      />
    </>
  );
});

export default InputComponent;
