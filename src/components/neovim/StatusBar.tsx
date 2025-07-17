import React from 'react';
import { GitBranch, Circle } from 'lucide-react';
import { HelpButton } from './HelpDialog';

interface StatusBarProps {
  mode: 'NORMAL' | 'INSERT' | 'VISUAL';
  filePath: string;
  fileType: string;
  line: number;
  column: number;
  gitBranch: string;
  onModeChange: (mode: 'NORMAL' | 'INSERT' | 'VISUAL') => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  mode,
  filePath,
  fileType,
  line,
  column,
  gitBranch,
  onModeChange,
}) => {
  const getModeClasses = () => {
    switch (mode) {
      case 'NORMAL':
        return 'nvim-mode-normal';
      case 'INSERT':
        return 'nvim-mode-insert';
      case 'VISUAL':
        return 'nvim-mode-visual';
      default:
        return 'nvim-mode-normal';
    }
  };

  const getFileName = () => {
    return filePath.split('/').pop() || 'untitled';
  };

  return (
    <div className="nvim-statusline flex items-center justify-between px-4 py-1">
      <div className="flex items-center space-x-4">
        {/* Mode indicator */}
        <div className={`${getModeClasses()} px-2 py-1 rounded text-xs font-bold`}>
          {mode}
        </div>
        
        {/* File info */}
        <div className="flex items-center space-x-2 text-nvim-statusline-fg">
          <span className="text-xs">{getFileName()}</span>
          <Circle className="w-1 h-1 fill-current" />
          <span className="text-xs text-nvim-comment">{fileType}</span>
        </div>
        
        {/* Git branch */}
        {gitBranch && (
          <div className="flex items-center space-x-1 text-nvim-comment">
            <GitBranch className="w-3 h-3" />
            <span className="text-xs">{gitBranch}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Help button */}
        <HelpButton />
        
        {/* File encoding */}
        <span className="text-xs text-nvim-comment">UTF-8</span>
        
        {/* Line ending */}
        <span className="text-xs text-nvim-comment">LF</span>
        
        {/* Position */}
        <div className="flex items-center space-x-2 text-nvim-statusline-fg">
          <span className="text-xs">{line}:{column}</span>
          <Circle className="w-1 h-1 fill-current" />
          <span className="text-xs">{Math.round((line / 100) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};