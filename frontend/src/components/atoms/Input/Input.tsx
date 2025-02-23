import React from "react";

type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold mb-1">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        className || ""
      }`}
      required={required}
    />
  </div>
);

export default Input;
