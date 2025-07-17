import React, { useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-nvim-bg bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-nvim-bg-alt border border-nvim-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-nvim-orange" />
            <h2 className="text-lg font-bold text-nvim-fg">Vim-Style Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-nvim-bg-visual rounded transition-colors duration-100"
          >
            <X className="w-5 h-5 text-nvim-comment hover:text-nvim-fg" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-nvim-green font-bold mb-2">Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nvim-comment">j</span>
                <span className="text-nvim-fg">Scroll down</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">k</span>
                <span className="text-nvim-fg">Scroll up</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">h</span>
                <span className="text-nvim-fg">Previous file</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">l</span>
                <span className="text-nvim-fg">Next file</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">g</span>
                <span className="text-nvim-fg">Go to top</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-nvim-blue font-bold mb-2">Modes</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nvim-comment">i</span>
                <span className="text-nvim-fg">Insert mode</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">v</span>
                <span className="text-nvim-fg">Visual mode</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nvim-comment">Escape</span>
                <span className="text-nvim-fg">Normal mode</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-nvim-purple font-bold mb-2">Search</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nvim-comment">/</span>
                <span className="text-nvim-fg">Search (coming soon)</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-nvim-border pt-4">
            <h3 className="text-nvim-orange font-bold mb-2">About This Portfolio</h3>
            <p className="text-nvim-fg text-sm leading-relaxed">
              This portfolio is designed to look and feel like a Neovim editor. 
              Navigate through different sections using the file explorer or keyboard shortcuts. 
              Each "file" represents a different aspect of my professional experience.
            </p>
          </div>
          
          <div className="border-t border-nvim-border pt-4">
            <h3 className="text-nvim-yellow font-bold mb-2">Mobile Users</h3>
            <p className="text-nvim-fg text-sm leading-relaxed">
              Keyboard shortcuts are disabled on mobile devices. Use the file explorer 
              and tab navigation to browse the portfolio content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 px-2 py-1 hover:bg-nvim-bg-visual rounded transition-colors duration-100"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4 text-nvim-comment" />
        <span className="text-xs text-nvim-comment">?</span>
      </button>
      
      <HelpDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};