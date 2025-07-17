import React from 'react';
import { ChevronRight, ChevronDown, Folder, File, FolderOpen } from 'lucide-react';
import { FileItem } from './NeovimLayout';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  onFolderToggle: (folderPath: string) => void;
}

const FileTreeItem: React.FC<{
  item: FileItem;
  level: number;
  onFileSelect: (file: FileItem) => void;
  onFolderToggle: (folderPath: string) => void;
}> = ({ item, level, onFileSelect, onFolderToggle }) => {
  const handleClick = () => {
    if (item.type === 'folder') {
      onFolderToggle(item.path);
    } else {
      onFileSelect(item);
    }
  };

  const getIcon = () => {
    if (item.type === 'folder') {
      return item.isOpen ? (
        <FolderOpen className="w-4 h-4 text-nvim-yellow" />
      ) : (
        <Folder className="w-4 h-4 text-nvim-yellow" />
      );
    }
    
    // File type icons
    if (item.name.endsWith('.md')) {
      return <File className="w-4 h-4 text-nvim-blue" />;
    }
    if (item.name.endsWith('.json')) {
      return <File className="w-4 h-4 text-nvim-green" />;
    }
    return <File className="w-4 h-4 text-nvim-fg-alt" />;
  };

  const getChevron = () => {
    if (item.type === 'folder') {
      return item.isOpen ? (
        <ChevronDown className="w-3 h-3 text-nvim-comment" />
      ) : (
        <ChevronRight className="w-3 h-3 text-nvim-comment" />
      );
    }
    return <div className="w-3 h-3" />;
  };

  return (
    <div>
      <div
        className={`
          flex items-center px-2 py-1 cursor-pointer select-none
          hover:bg-nvim-tree-hover transition-colors duration-100
          ${item.isActive ? 'bg-nvim-tree-hover text-nvim-tree-active' : 'text-nvim-tree-file'}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {getChevron()}
        <div className="flex items-center space-x-2 ml-1">
          {getIcon()}
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      </div>
      
      {item.type === 'folder' && item.isOpen && item.children && (
        <div className="animate-fade-in">
          {item.children.map((child, index) => (
            <FileTreeItem
              key={`${child.path}-${index}`}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileSelect,
  onFolderToggle,
}) => {
  return (
    <div className="nvim-file-tree h-full overflow-y-auto min-w-0">
      <div className="p-2 border-b border-nvim-border">
        <h3 className="text-xs font-bold text-nvim-fg-alt uppercase tracking-wide">
          EXPLORER
        </h3>
      </div>
      
      <div className="py-2">
        {files.map((file, index) => (
          <FileTreeItem
            key={`${file.path}-${index}`}
            item={file}
            level={0}
            onFileSelect={onFileSelect}
            onFolderToggle={onFolderToggle}
          />
        ))}
      </div>
    </div>
  );
};