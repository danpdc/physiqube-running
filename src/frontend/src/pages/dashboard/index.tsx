import React from 'react';
import AppLayout from '../../components/layout/AppLayout';

const Dashboard: React.FC = () => {
  return (
    <AppLayout username="John">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-primary">Dashboard</h1>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card flex flex-col p-6">
            <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">Today's Run</h3>
            <p className="text-2xl font-bold text-text-light-primary dark:text-text-primary">5.2 km</p>
            <div className="mt-2 text-xs text-green-500">+12% from last week</div>
          </div>
          
          <div className="card flex flex-col p-6">
            <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">Weekly Distance</h3>
            <p className="text-2xl font-bold text-text-light-primary dark:text-text-primary">32.7 km</p>
            <div className="mt-2 text-xs text-green-500">+8% from last week</div>
          </div>
          
          <div className="card flex flex-col p-6">
            <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">Avg. Pace</h3>
            <p className="text-2xl font-bold text-text-light-primary dark:text-text-primary">5:30 /km</p>
            <div className="mt-2 text-xs text-red-500">-3% from last week</div>
          </div>
          
          <div className="card flex flex-col p-6">
            <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">VO2 Max</h3>
            <p className="text-2xl font-bold text-text-light-primary dark:text-text-primary">48.2</p>
            <div className="mt-2 text-xs text-green-500">+2% from last month</div>
          </div>
        </div>
        
        {/* Recent activities */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-4">Recent Activities</h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-light-primary dark:text-text-primary">Morning Run</h3>
                  <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                    {item === 1 ? 'Today' : item === 2 ? 'Yesterday' : '2 days ago'} • 5.{item} km • {25 + item} min
                  </p>
                </div>
                <div className="text-sm font-medium text-primary">
                  View
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <a href="/activities" className="text-sm text-secondary hover:underline">View all activities</a>
          </div>
        </div>
        
        {/* Training plan */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-primary mb-4">Upcoming Training</h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 rounded-lg hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                    {item === 1 ? 'Tempo Run' : item === 2 ? 'Easy Recovery' : 'Long Run'}
                  </h3>
                  <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                    {item === 1 ? 'Tomorrow' : item === 2 ? 'In 2 days' : 'This weekend'} • {item === 1 ? '5 km' : item === 2 ? '3 km' : '10 km'}
                  </p>
                </div>
                <div>
                  <button className="btn btn-secondary py-1 px-3 text-xs">Start</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <a href="/training-plan" className="text-sm text-secondary hover:underline">View full training plan</a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;