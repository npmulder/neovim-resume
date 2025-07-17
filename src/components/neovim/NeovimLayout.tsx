import React, { useState, useEffect } from 'react';
import { FileExplorer } from './FileExplorer';
import { Editor } from './Editor';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';
import { KeyboardHandler } from './KeyboardHandler';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

export interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  isActive: boolean;
  isDirty: boolean;
}

const initialFiles: FileItem[] = [
  {
    name: 'neil-mulder-portfolio',
    path: '/neil-mulder-portfolio',
    type: 'folder',
    isOpen: true,
    children: [
      {
        name: 'src',
        path: '/neil-mulder-portfolio/src',
        type: 'folder',
        isOpen: true,
        children: [
          {
            name: 'profile.md',
            path: '/neil-mulder-portfolio/src/profile.md',
            type: 'file',
            isActive: true,
          },
          {
            name: 'experiences.md',
            path: '/neil-mulder-portfolio/src/experiences.md',
            type: 'file',
          },
          {
            name: 'skills.md',
            path: '/neil-mulder-portfolio/src/skills.md',
            type: 'file',
          },
          {
            name: 'achievements.md',
            path: '/neil-mulder-portfolio/src/achievements.md',
            type: 'file',
          },
          {
            name: 'education.md',
            path: '/neil-mulder-portfolio/src/education.md',
            type: 'file',
          },
          {
            name: 'projects.md',
            path: '/neil-mulder-portfolio/src/projects.md',
            type: 'file',
          },
        ],
      },
      {
        name: 'README.md',
        path: '/neil-mulder-portfolio/README.md',
        type: 'file',
      },
      {
        name: 'package.json',
        path: '/neil-mulder-portfolio/package.json',
        type: 'file',
      },
    ],
  },
];

export const NeovimLayout: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'profile',
      name: 'profile.md',
      path: '/neil-mulder-portfolio/src/profile.md',
      content: 'Loading...',
      isActive: true,
      isDirty: false,
    },
  ]);
  const [currentMode, setCurrentMode] = useState<'NORMAL' | 'INSERT' | 'VISUAL'>('NORMAL');
  const [currentLine, setCurrentLine] = useState(1);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [isKeyboardActive, setIsKeyboardActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileSelect = (file: FileItem) => {
    // Update active file in file tree
    const updateActiveFile = (items: FileItem[], targetPath: string): FileItem[] => {
      return items.map(item => ({
        ...item,
        isActive: item.path === targetPath && item.type === 'file',
        children: item.children ? updateActiveFile(item.children, targetPath) : undefined,
      }));
    };

    setFiles(updateActiveFile(files, file.path));

    // Create or activate tab
    const existingTab = tabs.find(tab => tab.path === file.path);
    if (existingTab) {
      setTabs(tabs.map(tab => ({
        ...tab,
        isActive: tab.path === file.path,
      })));
    } else {
      const newTab: Tab = {
        id: file.name.replace('.md', ''),
        name: file.name,
        path: file.path,
        content: 'Loading...',
        isActive: true,
        isDirty: false,
      };
      
      setTabs([
        ...tabs.map(tab => ({ ...tab, isActive: false })),
        newTab,
      ]);
    }
  };

  const handleTabClose = (tabId: string) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    if (updatedTabs.length === 0) {
      // If no tabs left, add a default tab
      setTabs([
        {
          id: 'profile',
          name: 'profile.md',
          path: '/neil-mulder-portfolio/src/profile.md',
          content: 'Loading...',
          isActive: true,
          isDirty: false,
        },
      ]);
    } else {
      // If the closed tab was active, activate the first remaining tab
      const closedTab = tabs.find(tab => tab.id === tabId);
      if (closedTab?.isActive && updatedTabs.length > 0) {
        updatedTabs[0].isActive = true;
      }
      setTabs(updatedTabs);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId,
    })));
  };

  const handleFolderToggle = (folderPath: string) => {
    const toggleFolder = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.path === folderPath && item.type === 'folder') {
          return { ...item, isOpen: !item.isOpen };
        }
        return {
          ...item,
          children: item.children ? toggleFolder(item.children) : undefined,
        };
      });
    };

    setFiles(toggleFolder(files));
  };

  const activeTab = tabs.find(tab => tab.isActive);
  
  const handleFileNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.isActive);
    const nextIndex = (currentIndex + 1) % tabs.length;
    handleTabSelect(tabs[nextIndex].id);
  };
  
  const handleFilePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.isActive);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    handleTabSelect(tabs[previousIndex].id);
  };
  
  const handleSearch = () => {
    // Toggle search functionality (placeholder)
    console.log('Search functionality would go here');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-nvim-bg font-mono text-sm overflow-hidden">
      <KeyboardHandler
        onFileNext={handleFileNext}
        onFilePrevious={handleFilePrevious}
        onSearch={handleSearch}
        onModeChange={setCurrentMode}
        currentMode={currentMode}
        isActive={isKeyboardActive && !isMobile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile: Hidden file explorer, Desktop: Always visible */}
        <div className={`${isMobile ? 'hidden' : 'block'}`}>
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            onFolderToggle={handleFolderToggle}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TabBar
            tabs={tabs}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
            isMobile={isMobile}
            onMobileMenuToggle={() => {
              // TODO: Implement mobile file explorer toggle
              console.log('Mobile menu toggle');
            }}
          />
          <Editor
            activeTab={activeTab}
            currentLine={currentLine}
            currentColumn={currentColumn}
            onLineChange={setCurrentLine}
            onColumnChange={setCurrentColumn}
          />
        </div>
      </div>
      <StatusBar
        mode={currentMode}
        filePath={activeTab?.path || ''}
        fileType="markdown"
        line={currentLine}
        column={currentColumn}
        gitBranch="main"
        onModeChange={setCurrentMode}
      />
    </div>
  );
};