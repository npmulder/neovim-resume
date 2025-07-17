import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tab } from './NeovimLayout';
import { LoadingSpinner } from './LoadingSpinner';

interface EditorProps {
  activeTab: Tab | undefined;
  currentLine: number;
  currentColumn: number;
  onLineChange: (line: number) => void;
  onColumnChange: (column: number) => void;
}

const API_BASE_URL = 'https://resume-api.npmulder.dev';

// Map file paths to API endpoints
const getApiEndpoint = (path: string): string => {
  if (path.includes('profile.md')) return `${API_BASE_URL}/api/v1/profile`;
  if (path.includes('experiences.md')) return `${API_BASE_URL}/api/v1/experiences`;
  if (path.includes('skills.md')) return `${API_BASE_URL}/api/v1/skills`;
  if (path.includes('achievements.md')) return `${API_BASE_URL}/api/v1/achievements`;
  if (path.includes('education.md')) return `${API_BASE_URL}/api/v1/education`;
  if (path.includes('projects.md')) return `${API_BASE_URL}/api/v1/projects`;
  return '';
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
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTab) return;

    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = getApiEndpoint(activeTab.path);
        if (!endpoint) {
          // For non-API files, show placeholder content
          if (activeTab.name === 'README.md') {
            setContent(`# Neil Mulder - Senior .NET Backend Developer

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

Use the file explorer to navigate through different sections!`);
          } else if (activeTab.name === 'package.json') {
            setContent(`{
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
}`);
          } else {
            setContent('Loading...');
          }
          return;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert API response to markdown format
        const markdownContent = formatApiResponse(data, activeTab.name);
        setContent(markdownContent);
        
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setContent(`# Error Loading Content

Failed to load content for ${activeTab.name}

**Error:** ${err instanceof Error ? err.message : 'Unknown error'}

This could be due to:
- Network connection issues
- API endpoint not available
- CORS restrictions

Please check the console for more details.`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab]);

  const formatApiResponse = (data: any, fileName: string): string => {
    // This is a placeholder - you'll need to adapt this based on your actual API responses
    try {
      if (typeof data === 'string') {
        return data;
      }
      
      if (typeof data === 'object') {
        return `# ${fileName.replace('.md', '').toUpperCase()}

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

*Note: This is raw API data. The actual implementation would format this into proper markdown based on your API structure.*`;
      }
      
      return `# ${fileName.replace('.md', '').toUpperCase()}

Content loaded successfully!

${JSON.stringify(data, null, 2)}`;
    } catch (err) {
      return `# Error formatting content

Failed to format API response for ${fileName}`;
    }
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
          <MarkdownRenderer content={content} />
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