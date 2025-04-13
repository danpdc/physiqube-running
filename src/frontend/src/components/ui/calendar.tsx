import React, { useState } from "react";

interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  initialFocus?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ 
  mode = "single", 
  selected, 
  onSelect, 
  disabled,
  initialFocus 
}) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  
  // Get the days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selected && date.toDateString() === selected.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();
      const isDisabled = disabled ? disabled(date) : false;
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onSelect && onSelect(date)}
          disabled={isDisabled}
          className={`h-10 w-10 rounded-md flex items-center justify-center text-sm
            ${isSelected ? 'bg-primary text-white' : ''}
            ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
            ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
          type="button"
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format the month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="p-4 bg-white dark:bg-dark-card rounded-md">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={previousMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="font-semibold">{formatMonthYear(currentMonth)}</div>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="h-10 w-10 flex items-center justify-center text-xs text-text-light-secondary dark:text-text-secondary font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

export { Calendar };