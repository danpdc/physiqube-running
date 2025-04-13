import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-light-card dark:bg-dark-card rounded-xl shadow overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export { Card, CardContent };