import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tab } from './NeovimLayout';
import { LoadingSpinner } from './LoadingSpinner';
import { useResumeDataByPath } from '@/hooks/useResumeData';
import { convertToMarkdown, generateFallbackContent } from '@/utils/jsonToMarkdown';

interface EditorProps {
  activeTab: Tab | undefined;
  currentLine: number;
  currentColumn: number;
  onLineChange: (line: number) => void;
  onColumnChange: (column: number) => void;
}

// Static content for non-API files
const getStaticContent = (fileName: string): string | null => {
  if (fileName === 'README.md') {
    return `# Neil Mulder - Senior .NET Backend Developer

Welcome to my portfolio! This is a Neovim-themed showcase of my professional journey.

## Navigation
- **profile.md** - Personal information and tech stack
- **experiences.md** - Work history and achievements
- **skills.md** - Technical skills and competencies
- **achievements.md** - Key accomplishments
- **education.md** - Certifications and learning
- **projects.md** - Portfolio projects

## Tech Stack
- .NET Core / .NET 6+
- C# / ASP.NET Core
- Entity Framework Core
- SQL Server / PostgreSQL
- Docker / Kubernetes
- Azure / AWS
- And much more...

Use the file explorer to navigate through different sections!`;
  }
  
  if (fileName === 'package.json') {
    return `{
  "name": "neil-mulder-portfolio",
  "version": "1.0.0",
  "description": "Senior .NET Backend Developer Portfolio",
  "author": "Neil Mulder",
  "license": "MIT",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "keywords": [
    "portfolio",
    "developer",
    "dotnet",
    "csharp",
    "backend"
  ]
}`;
  }
  
  return null;
};

const LineNumbers: React.FC<{ content: string; currentLine: number }> = ({ 
  content, 
  currentLine 
}) => {
  const lines = content.split('\n');
  
  return (
    <div className="nvim-line-numbers bg-nvim-bg border-r border-nvim-border">
      {lines.map((_, index) => (
        <div
          key={index}
          className={`nvim-line-number ${
            index + 1 === currentLine ? 'text-nvim-fg font-bold' : 'text-nvim-linenr'
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-nvim-orange mb-4 border-b border-nvim-border pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-nvim-blue mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold text-nvim-green mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-nvim-fg mb-4 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="text-nvim-fg mb-4 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="text-nvim-fg mb-4 space-y-1">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start">
            <span className="text-nvim-orange mr-2">•</span>
            <span>{children}</span>
          </li>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          
          if (isInline) {
            return (
              <code className="bg-nvim-bg-alt text-nvim-orange px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          
          const match = /language-(\w+)/.exec(className || '');
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match?.[1] || 'text'}
              PreTag="div"
              className="!bg-nvim-bg-alt !text-nvim-fg rounded-md"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-nvim-blue pl-4 italic text-nvim-comment mb-4">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="text-nvim-orange font-bold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-nvim-purple italic">{children}</em>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-nvim-blue hover:text-nvim-blue-bright underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const Editor: React.FC<EditorProps> = ({
  activeTab,
  currentLine,
  currentColumn,
  onLineChange,
  onColumnChange,
}) => {
  // Use the custom hook for API data fetching
  const { data, loading, error, isOffline, retry } = useResumeDataByPath(
    activeTab?.path || ''
  );

  // Generate content based on data and file type
  const getContent = (): string => {
    if (!activeTab) return '';
    
    // Check for static content first
    const staticContent = getStaticContent(activeTab.name);
    if (staticContent) {
      return staticContent;
    }
    
    // Handle API data
    if (loading) {
      return 'Loading...';
    }
    
    if (error) {
      if (isOffline) {
        return generateFallbackContent(activeTab.name);
      }
      return `# Error Loading Content\n\nFailed to load content for ${activeTab.name}\n\n**Error:** ${error}\n\n[Click here to retry](javascript:void(0))`;
    }
    
    if (data) {
      return convertToMarkdown(data, activeTab.name);
    }
    
    return generateFallbackContent(activeTab.name);
  };

  const content = getContent();

  // Handle retry button click
  const handleRetry = () => {
    retry();
  };

  if (!activeTab) {
    return (
      <div className="nvim-editor flex items-center justify-center">
        <div className="text-nvim-comment">
          <p>No file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nvim-editor flex h-full">
      <LineNumbers content={content} currentLine={currentLine} />
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner 
              text={`Loading ${activeTab.name}...`} 
              size="lg" 
            />
          </div>
        ) : (
          <div>
            <MarkdownRenderer content={content} />
            {/* Show retry button if there's an error */}
            {error && (
              <div className="mt-4 p-4 bg-nvim-bg-alt border border-nvim-border rounded">
                <div className="flex items-center justify-between">
                  <span className="text-nvim-comment text-sm">
                    {isOffline ? 'Connection lost. Showing cached/fallback content.' : 'Failed to load latest content.'}
                  </span>
                  <button
                    onClick={handleRetry}
                    className="text-nvim-blue hover:text-nvim-blue-bright text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Cursor indicator */}
      <div
        className="fixed w-0.5 h-5 bg-nvim-cursor animate-blink pointer-events-none"
        style={{
          left: `${300 + 50 + currentColumn * 8}px`,
          top: `${24 + currentLine * 20}px`,
        }}
      />
    </div>
  );
};