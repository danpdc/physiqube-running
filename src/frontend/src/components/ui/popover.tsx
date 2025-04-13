import React, { useState } from "react";

interface PopoverProps {
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ children }) => {
  return (
    <div className="relative inline-block w-full">
      {children}
    </div>
  );
};

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild }) => {
  return <>{children}</>;
};

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "center" | "start" | "end";
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className = "", align = "center", ...props }, ref) => {
    // Alignment classes
    const alignClasses = {
      center: "left-1/2 -translate-x-1/2",
      start: "left-0",
      end: "right-0",
    };

    return (
      <div
        ref={ref}
        className={`absolute z-50 mt-2 rounded-md border border-gray-200 bg-white p-4 shadow-md dark:border-gray-800 dark:bg-dark-card ${alignClasses[align]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };