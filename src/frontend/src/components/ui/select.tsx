import React, { useState } from "react";

// SelectTrigger Component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-text-light-primary dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        disabled={disabled}
        type="button"
        {...props}
      >
        {children}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

// SelectValue Component
interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => {
  return (
    <span className="truncate">{children || placeholder}</span>
  );
};

// SelectContent Component
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md animate-in fade-in-80 ${className}`}
        {...props}
      >
        <div className="max-h-[300px] overflow-auto p-1">
          {children}
        </div>
      </div>
    );
  }
);

SelectContent.displayName = "SelectContent";

// SelectItem Component
interface SelectItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className = "", children, value, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-light-background dark:focus:bg-dark-background hover:bg-light-background dark:hover:bg-dark-background ${className}`}
        data-value={value}
        role="option"
        aria-selected={false}
        {...props}
      >
        <span className="flex-1 truncate">{children}</span>
      </li>
    );
  }
);

SelectItem.displayName = "SelectItem";

// Main Select Component
interface SelectProps<T extends string = string> {
  value: T;
  children: React.ReactNode;
  onValueChange: (value: T) => void;
  disabled?: boolean;
}

const Select = <T extends string = string>({ 
  value, 
  onValueChange, 
  children, 
  disabled = false 
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find all SelectItem children and their values
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const item = target.closest('li[data-value]');
    
    if (item) {
      // Using type assertion more safely here
      const newValue = (item.getAttribute('data-value') || '') as unknown as T;
      onValueChange(newValue);
      setIsOpen(false);
    }
  };
  
  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Clone trigger element and add onClick handler
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === SelectTrigger) {
        return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, {
          onClick: handleTriggerClick,
          disabled
        });
      }
      
      if (child.type === SelectContent) {
        return isOpen ? (
          <div 
            className="relative"
            onClick={handleClick}
          >
            {child}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
          </div>
        ) : null;
      }
    }
    return child;
  });
  
  return <>{processedChildren}</>;
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };