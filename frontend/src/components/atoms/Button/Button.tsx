import React from "react";

type ButtonVariant = "primary" | "secondary" | "text" | "outline" | "icon";

interface ButtonProps {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  type = "button",
  loading = false,
  disabled = false,
}) => {
  if (variant === "primary") {
    return (
      <button
        type={type}
        className={`
          flex justify-center items-center gap-2 px-4 py-2 
          bg-blue-600 text-white rounded-lg 
          hover:bg-blue-700 transition-colors 
          shadow-md hover:shadow-lg font-bold
          disabled:opacity-50 disabled:cursor-not-allowed 
          disabled:hover:bg-blue-600 disabled:hover:shadow-md
          ${className}
        `}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }

  return null;
};

export default Button;
