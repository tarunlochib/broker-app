import clsx from "clsx";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-blue-600 shadow-sm",
          className
        )}
        {...props}
      />
    );
  }
);


