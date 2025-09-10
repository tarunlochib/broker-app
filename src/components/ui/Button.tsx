import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import React from "react";

const button = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-sm",
        secondary: "bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-900 shadow-sm",
        outline: "border border-gray-300 hover:bg-gray-50 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-900",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & { 
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild, children, ...props }: ButtonProps) {
  const buttonClasses = clsx(button({ variant, size }), className);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: clsx(buttonClasses, (children.props as { className?: string }).className),
      ...props,
    } as React.HTMLAttributes<HTMLElement>);
  }
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}


