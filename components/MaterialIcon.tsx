import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ name, className = '', filled = false }) => {
  // 'material-symbols-outlined' is loaded in index.html
  // We can add 'fill' class if using the variable font features, but usually 'material-symbols-outlined' is default.
  // To support filled, we might need strict CSS settings, but here we adhere to the requested Outlined style primarily.
  // If filled is requested, we apply a specific variation or class if configured, but standard symbols are controlled via font-variation-settings.
  // For simplicity in this stack, we just render the icon name.
  
  return (
    <span 
      className={`material-symbols-outlined ${className} select-none`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
    >
      {name}
    </span>
  );
};