import React from 'react';
import { X, Circle, Menu } from 'lucide-react';
import { Tab } from './NeovimLayout';

interface TabBarProps {
  tabs: Tab[];
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  isMobile?: boolean;
  onMobileMenuToggle?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  onTabSelect,
  onTabClose,
  isMobile = false,
  onMobileMenuToggle,
}) => {
  return (
    <div className="bg-nvim-bg-alt border-b border-nvim-border flex items-center overflow-x-auto">
      {/* Mobile menu button */}
      {isMobile && onMobileMenuToggle && (
        <button
          onClick={onMobileMenuToggle}
          className="p-2 hover:bg-nvim-bg-highlight transition-colors duration-100 border-r border-nvim-border"
          title="Open file explorer"
        >
          <Menu className="w-4 h-4 text-nvim-fg-alt" />
        </button>
      )}
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center space-x-2 px-4 py-2 cursor-pointer select-none
            border-r border-nvim-border min-w-0 max-w-xs
            hover:bg-nvim-bg-highlight transition-colors duration-100
            ${tab.isActive ? 'bg-nvim-bg text-nvim-fg' : 'bg-nvim-bg-alt text-nvim-fg-alt'}
          `}
          onClick={() => onTabSelect(tab.id)}
        >
          {/* File icon */}
          <Circle className="w-3 h-3 fill-current text-nvim-blue flex-shrink-0" />
          
          {/* File name */}
          <span className="text-sm font-medium truncate">
            {tab.name}
          </span>
          
          {/* Dirty indicator */}
          {tab.isDirty && (
            <Circle className="w-2 h-2 fill-current text-nvim-orange flex-shrink-0" />
          )}
          
          {/* Close button */}
          <button
            className="p-1 hover:bg-nvim-bg-visual rounded transition-colors duration-100 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X className="w-3 h-3 text-nvim-comment hover:text-nvim-fg" />
          </button>
        </div>
      ))}
      
      {/* Empty space */}
      <div className="flex-1 bg-nvim-bg-alt" />
    </div>
  );
};