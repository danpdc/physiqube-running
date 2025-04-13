import React, { useState } from 'react';
// Use barrel imports from the ui directory
import { 
  Button, 
  Label, 
  Card, 
  CardContent, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Slider
} from '../../../components/ui';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
// Import react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css'; // Import custom styles for date picker

// Inline SVG icon as a component
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

interface GoalsData {
  primaryGoal: 'get-fitter' | 'build-consistency' | 'race' | '';
  raceDistance?: '5k' | '10k' | 'half-marathon' | 'marathon' | 'ultra' | '';
  raceDate?: string;
  weeklyTrainingDays?: number;
}

interface Step2GoalsProps {
  userData: GoalsData;
  updateUserData: (data: Partial<GoalsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Goals: React.FC<Step2GoalsProps> = ({ userData, updateUserData, onNext, onBack }) => {
  const [formData, setFormData] = useState<GoalsData>({
    primaryGoal: userData.primaryGoal || '',
    raceDistance: userData.raceDistance || '',
    raceDate: userData.raceDate || '',
    weeklyTrainingDays: userData.weeklyTrainingDays || 3
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date | null>(
    formData.raceDate ? new Date(formData.raceDate) : null
  );

  const handleChange = <K extends keyof GoalsData>(field: K, value: GoalsData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // If user selects "race", automatically scroll to the race-specific fields
    if (field === 'primaryGoal' && value === 'race') {
      setTimeout(() => {
        document.getElementById('raceDistanceSection')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
    
    // Validate race date if provided but remove automatic advancement
    if (formData.primaryGoal === 'race' && field === 'raceDate' && value) {
      const newErrors: Record<string, string> = {};
      
      // Check if date is in the future
      const selectedDate = new Date(value as string);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.raceDate = 'Race date must be in the future';
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = 'Please select a primary goal';
    }
    
    // Race-specific validations
    if (formData.primaryGoal === 'race') {
      if (!formData.raceDistance) {
        newErrors.raceDistance = 'Please select a race distance';
      }
      
      if (!formData.raceDate) {
        newErrors.raceDate = 'Please select your race date';
      } else {
        // Check if date is in the future
        const selectedDate = new Date(formData.raceDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          newErrors.raceDate = 'Race date must be in the future';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateUserData(formData);
      onNext();
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleChange('raceDate', dateString);
    }
  };

  // Calculate minimum date (today)
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  // Custom input for the date picker to match our UI
  const CustomInput = React.forwardRef<HTMLButtonElement, {
    value?: string;
    onClick?: () => void;
    className?: string;
    hasError?: boolean;
  }>((props, ref) => (
    <button
      type="button"
      className={cn(
        "w-full bg-transparent flex items-center text-left px-3 py-2 border rounded-md h-10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "dark:bg-gray-900 dark:border-gray-700",
        !props.value && "text-text-light-secondary dark:text-text-secondary",
        props.hasError && "border-red-500",
        props.className
      )}
      onClick={props.onClick}
      ref={ref}
    >
      <CalendarIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
      {props.value || "Select your race date"}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  const getTrainingDaysFeedback = () => {
    const days = formData.weeklyTrainingDays || 0;
    if (days <= 1) return "Consider adding more days for better results";
    if (days <= 3) return "Good for building consistency";
    if (days <= 5) return "Perfect for consistent progress";
    return "Great for focused training";
  };

  const goalOptions = [
    { 
      id: 'get-fitter', 
      title: 'Get Fitter', 
      icon: '🧘‍♂️', 
      description: 'Improve overall fitness and endurance' 
    },
    { 
      id: 'build-consistency', 
      title: 'Build Consistency', 
      icon: '🔁', 
      description: 'Establish a regular running routine' 
    },
    { 
      id: 'race', 
      title: 'Train for a Race', 
      icon: '🏁', 
      description: 'Prepare for an upcoming race event' 
    }
  ];

  return (
    <div className="py-4 px-2">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-3">Your Goals, Your Dreams!</h1>
        <p className="text-text-light-secondary dark:text-text-secondary">
          Tell us what you're aiming for, and we'll help you get there.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Primary Goal */}
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block">
              A) Primary Goal <span className="text-red-500">*</span>
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goalOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    formData.primaryGoal === option.id ? 
                      "ring-2 ring-primary border-primary bg-primary/5" : 
                      ""
                  )}
                  onClick={() => handleChange('primaryGoal', option.id as GoalsData['primaryGoal'])}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <h3 className="font-medium mb-1">{option.title}</h3>
                    <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {errors.primaryGoal && (
              <p className="text-red-500 text-sm mt-2">{errors.primaryGoal}</p>
            )}
          </div>

          {/* Race-specific fields (conditional) */}
          {formData.primaryGoal === 'race' && (
            <div id="raceDistanceSection" className="space-y-8 animate-fade-in duration-300">
              <div className="mb-6">
                <Label htmlFor="raceDistance" className="text-lg font-semibold mb-4 block">
                  B) Race Distance <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['5k', '10k', 'half-marathon', 'marathon', 'ultra'].map((distance) => (
                    <Button
                      key={distance}
                      type="button"
                      variant={formData.raceDistance === distance ? "default" : "outline"}
                      onClick={() => handleChange('raceDistance', distance as GoalsData['raceDistance'])}
                      className="h-12"
                    >
                      {distance === 'half-marathon' ? 'Half Marathon' : 
                       distance === 'ultra' ? 'Ultra' : 
                       distance.toUpperCase()}
                    </Button>
                  ))}
                </div>
                {errors.raceDistance && (
                  <p className="text-red-500 text-sm mt-2">{errors.raceDistance}</p>
                )}
              </div>
              
              <div className="mb-6">
                <Label htmlFor="raceDate" className="text-lg font-semibold mb-4 block">
                  Race Date <span className="text-red-500">*</span>
                </Label>
                <div className={errors.raceDate ? 'mb-1' : ''}>
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    minDate={minDate}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select your race date"
                    className={cn(
                      "w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                      "dark:bg-gray-900 dark:border-gray-700",
                      errors.raceDate && "border-red-500"
                    )}
                    customInput={<CustomInput hasError={!!errors.raceDate} />}
                  />
                </div>
                {errors.raceDate && (
                  <p className="text-red-500 text-sm mt-2">{errors.raceDate}</p>
                )}
              </div>
            </div>
          )}

          {/* Weekly Training Days */}
          <div className="mb-6">
            <Label className="text-lg font-semibold mb-3 block">
              {formData.primaryGoal === 'race' ? 'C' : 'B'}) How many days per week can you train?
            </Label>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Training days per week: <strong>{formData.weeklyTrainingDays}</strong></span>
                <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                  {getTrainingDaysFeedback()}
                </span>
              </div>
              <Slider
                defaultValue={[formData.weeklyTrainingDays || 3]}
                min={1}
                max={7}
                step={1}
                onValueChange={(values) => handleChange('weeklyTrainingDays', values[0])}
              />
              <div className="flex justify-between text-sm text-text-light-secondary dark:text-text-secondary">
                <span>1 day</span>
                <span>7 days</span>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="submit"
            >
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step2Goals;