import React, { useState } from 'react';
// Use barrel imports from the ui directory
import { Button, Label, Card, CardContent } from '../../../components/ui';
import { cn } from '../../../lib/utils';

// Inline SVG icons as components with className props
const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const ComputerDesktopIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
  </svg>
);

interface PreferencesData {
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  connectStrava: boolean;
}

interface Step3PreferencesProps {
  userData: PreferencesData;
  updateUserData: (data: Partial<PreferencesData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3Preferences: React.FC<Step3PreferencesProps> = ({ 
  userData, 
  updateUserData, 
  onNext, 
  onBack 
}) => {
  const [formData, setFormData] = useState<PreferencesData>({
    measurementSystem: userData.measurementSystem || 'metric',
    theme: userData.theme || 'dark',
    connectStrava: userData.connectStrava || false
  });

  const handleChange = <K extends keyof PreferencesData>(field: K, value: PreferencesData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserData(formData);
    onNext();
  };

  const handleStravaConnect = () => {
    // In a real implementation, this would open the Strava OAuth flow
    // For now, we'll just toggle the state to simulate connection
    handleChange('connectStrava', true);
  };

  return (
    <div className="py-4 px-2">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-3">Final Touches</h1>
        <p className="text-text-light-secondary dark:text-text-secondary">
          Customize your experience and sync your training history.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          {/* Measurement System */}
          <div>
            <Label className="text-lg font-semibold mb-6 block">
              What measurement system do you prefer?
            </Label>
            
            <div className="flex gap-4 max-w-md">
              <Button
                type="button"
                variant={formData.measurementSystem === 'metric' ? "default" : "outline"}
                className="w-full py-6"
                onClick={() => handleChange('measurementSystem', 'metric')}
              >
                Metric
                <span className="block text-xs opacity-70 mt-1">km, kg</span>
              </Button>
              
              <Button
                type="button"
                variant={formData.measurementSystem === 'imperial' ? "default" : "outline"}
                className="w-full py-6"
                onClick={() => handleChange('measurementSystem', 'imperial')}
              >
                Imperial
                <span className="block text-xs opacity-70 mt-1">mi, lb</span>
              </Button>
            </div>
          </div>
          
          {/* Theme Preference */}
          <div>
            <Label className="text-lg font-semibold mb-6 block">
              Choose your theme
            </Label>
            
            <div className="grid grid-cols-3 gap-4 max-w-lg">
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  formData.theme === 'light' ? 
                    "ring-2 ring-primary border-primary" : 
                    ""
                )}
                onClick={() => handleChange('theme', 'light')}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center gap-3 h-32">
                  <SunIcon className="w-8 h-8" />
                  <div className="text-center">
                    <p>Light</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  formData.theme === 'dark' ? 
                    "ring-2 ring-primary border-primary" : 
                    ""
                )}
                onClick={() => handleChange('theme', 'dark')}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center gap-3 h-32">
                  <MoonIcon className="w-8 h-8" />
                  <div className="text-center">
                    <p>Dark</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  formData.theme === 'auto' ? 
                    "ring-2 ring-primary border-primary" : 
                    ""
                )}
                onClick={() => handleChange('theme', 'auto')}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center gap-3 h-32">
                  <ComputerDesktopIcon className="w-8 h-8" />
                  <div className="text-center">
                    <p>Auto</p>
                    <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                      (System)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Connect to Strava */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">
              Connect your Strava account
            </Label>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Sync your past runs from Strava</h3>
                    <p className="text-text-light-secondary dark:text-text-secondary mb-2">
                      We'll use your running history to fine-tune your plan.
                      This happens in the background.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <Button
                      type="button"
                      className={cn(
                        "bg-[#FC4C02] hover:bg-[#E34402] transition-all",
                        formData.connectStrava && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={handleStravaConnect}
                      disabled={formData.connectStrava}
                    >
                      {formData.connectStrava ? (
                        <>Connected</>
                      ) : (
                        <>Connect with Strava</>
                      )}
                    </Button>
                    {!formData.connectStrava && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="text-text-light-secondary dark:text-text-secondary"
                        onClick={() => onNext()}
                      >
                        Skip for now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step3Preferences;