import React from 'react';
import { Button } from '../../../components/ui';

// Inline SVG icon as a component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

interface CompletionProps {
  firstName: string;
  userData: any;
  onComplete: () => void;
}

const Step4Completion: React.FC<CompletionProps> = ({ firstName, userData, onComplete }) => {
  // Handle completion
  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6 animate-slide-in-from-bottom">
        <CheckIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      
      <h1 className="text-3xl font-bold mb-3 text-center">
        🎉 You're all set, {firstName}!
      </h1>
      
      <p className="text-xl text-center text-text-light-secondary dark:text-text-secondary mb-8 max-w-md">
        We've got everything we need to help you run smarter and reach your goals.
      </p>
      
      {/* Confirmation highlights */}
      <div className="bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-10 w-full max-w-md">
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>Your training goals are set</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>Your preferences are saved</span>
          </li>
          {userData.connectStrava && (
            <li className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-green-500" />
              <span>Strava sync is running in the background</span>
            </li>
          )}
          <li className="flex items-center gap-3">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>AI coach is ready to generate your plan</span>
          </li>
        </ul>
      </div>
      
      <Button 
        className="animate-bounce-slow"
        size="lg"
        onClick={handleComplete}
      >
        Go to my dashboard
      </Button>
    </div>
  );
};

export default Step4Completion;