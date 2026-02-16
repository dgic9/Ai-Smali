import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export const TopBar: React.FC = () => {
  return (
    <div className="h-16 bg-[#1a1c1e] flex items-center justify-between px-4 sticky top-0 z-50 border-b border-[#444746]/30 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="text-[#e2e2e6] hover:bg-[#e2e2e6]/10 p-2 rounded-full transition-colors">
          <MaterialIcon name="menu" />
        </button>
        <h1 className="text-xl font-medium text-[#e2e2e6] tracking-wide">Smali Master</h1>
      </div>
      <div className="flex items-center">
        <button className="text-[#e2e2e6] hover:bg-[#e2e2e6]/10 p-2 rounded-full transition-colors">
          <MaterialIcon name="account_circle" />
        </button>
      </div>
    </div>
  );
};