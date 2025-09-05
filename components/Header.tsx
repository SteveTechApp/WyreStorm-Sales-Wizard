import React from 'react';
import Logo from './Logo';
import { UserProfile, UnitSystem, Currency } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface HeaderProps {
  onNewProject: () => void;
  onShowProfile: () => void;
  userProfile: UserProfile | null;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  onProfileChange: (profile: UserProfile) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onShowProfile, userProfile, unitSystem, onUnitSystemChange, onProfileChange }) => {
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (userProfile) {
      onProfileChange({ ...userProfile, currency: e.target.value as Currency });
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-xl font-semibold text-gray-700 hidden sm:block">AI Sales Assistant</h1>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Currency Applet */}
        <div className="relative">
          <select
            value={userProfile?.currency || 'GBP'}
            onChange={handleCurrencyChange}
            className="font-medium text-sm text-gray-600 hover:text-[#008A3A] transition-colors p-2 rounded-md bg-gray-100 hover:bg-gray-200 appearance-none pr-8 cursor-pointer"
            title="Select Project Currency"
          >
            {Object.entries(CURRENCY_OPTIONS).map(([code, { symbol, name }]) => (
              <option key={code} value={code}>{`${symbol} (${code})`}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <button
          onClick={() => onUnitSystemChange(unitSystem === 'imperial' ? 'metric' : 'imperial')}
          className="font-medium text-sm text-gray-600 hover:text-[#008A3A] transition-colors p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          title={`Switch to ${unitSystem === 'imperial' ? 'Metric' : 'Imperial'} units`}
        >
          {unitSystem === 'imperial' ? 'ft (Imperial)' : 'm (Metric)'}
        </button>
        <button
          onClick={onNewProject}
          className="font-medium text-gray-600 hover:text-[#008A3A] transition-colors"
        >
          New Project
        </button>
        <button onClick={onShowProfile} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userProfile?.logoUrl ? (
              <img src={userProfile.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
                </svg>
            )}
          </div>
          <span className="font-semibold text-gray-700 hidden md:block">{userProfile?.company || 'My Company'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;