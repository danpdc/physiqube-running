import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none";
    
    // Size classes
    const sizeClasses = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8 text-base"
    };
    
    // Variant classes
    const variantClasses = {
      default: "bg-primary text-white hover:bg-opacity-90 focus:ring-primary",
      outline: "border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-light-background dark:hover:bg-dark-background text-text-light-primary dark:text-text-primary",
      ghost: "bg-transparent hover:bg-light-background dark:hover:bg-dark-background text-text-light-primary dark:text-text-primary",
      link: "bg-transparent underline-offset-4 hover:underline text-primary hover:bg-transparent"
    };
    
    const combinedClassNames = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    ].join(" ");
    
    return (
      <button className={combinedClassNames} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };