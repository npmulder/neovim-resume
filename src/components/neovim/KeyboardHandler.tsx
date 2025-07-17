import React, { useEffect, useCallback } from 'react';

interface KeyboardHandlerProps {
  onFileNext: () => void;
  onFilePrevious: () => void;
  onSearch: () => void;
  onModeChange: (mode: 'NORMAL' | 'INSERT' | 'VISUAL') => void;
  currentMode: 'NORMAL' | 'INSERT' | 'VISUAL';
  isActive: boolean;
}

export const KeyboardHandler: React.FC<KeyboardHandlerProps> = ({
  onFileNext,
  onFilePrevious,
  onSearch,
  onModeChange,
  currentMode,
  isActive,
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    
    // Only handle shortcuts in NORMAL mode
    if (currentMode !== 'NORMAL') return;
    
    // Prevent default behavior for vim-style shortcuts
    const key = event.key.toLowerCase();
    
    switch (key) {
      case 'j':
        // Scroll down (j in vim)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          window.scrollBy(0, 40);
        }
        break;
        
      case 'k':
        // Scroll up (k in vim)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          window.scrollBy(0, -40);
        }
        break;
        
      case 'h':
        // Previous file (h in vim for left)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          onFilePrevious();
        }
        break;
        
      case 'l':
        // Next file (l in vim for right)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          onFileNext();
        }
        break;
        
      case '/':
        // Search
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          onSearch();
        }
        break;
        
      case 'i':
        // Insert mode
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          onModeChange('INSERT');
        }
        break;
        
      case 'v':
        // Visual mode
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          onModeChange('VISUAL');
        }
        break;
        
      case 'escape':
        // Return to normal mode
        event.preventDefault();
        onModeChange('NORMAL');
        break;
        
      case 'g':
        // Go to top (gg in vim)
        if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
          event.preventDefault();
          window.scrollTo(0, 0);
        }
        break;
        
      default:
        break;
    }
  }, [isActive, currentMode, onFileNext, onFilePrevious, onSearch, onModeChange]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null; // This component doesn't render anything
};