import React from 'react';
import { Tab } from '../types';
import { MaterialIcon } from './MaterialIcon';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

// NOTE: Ideally labels should come from props for translation, 
// but for simplicity in this file structure we'll use generic icons that represent the state well.
// The user can see the tab name change in App.tsx logic if we passed it down, 
// but let's keep the nav simple and standard.

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: Tab; icon: string }[] = [
    { id: 'learn', icon: 'school' },
    { id: 'editor', icon: 'code_blocks' },
    { id: 'tutor', icon: 'smart_toy' },
  ];

  return (
    <div className="h-20 bg-[#1e1f20] border-t border-[#444746]/30 flex justify-around items-center px-2 sticky bottom-0 z-50 pb-2">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center justify-center w-full gap-1 group"
          >
            <div
              className={`px-5 py-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'bg-[#004a77] text-[#d3e3fd]' : 'bg-transparent text-[#c4c7c5] group-hover:bg-[#444746]/20'
              }`}
            >
              <MaterialIcon name={item.icon} filled={isActive} className="text-2xl" />
            </div>
            {/* Indicator Dot for Active State instead of text to save space and translation complexity in this dumb component */}
            <span
              className={`h-1 w-1 rounded-full transition-all ${
                isActive ? 'bg-[#d3e3fd]' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};