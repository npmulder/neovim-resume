import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div 
        className={`${sizeClasses[size]} border-2 border-nvim-comment border-t-nvim-orange rounded-full animate-spin`}
      />
      {text && (
        <span className="text-nvim-comment text-sm font-mono animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};