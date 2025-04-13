import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-text-light-primary dark:text-text-primary ${className}`}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };