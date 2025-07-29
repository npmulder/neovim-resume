import json2md from 'json2md';
import {
  Profile,
  Experience,
  Skill,
  Achievement,
  Education,
  Project,
  ProfileResponse,
  ExperiencesResponse,
  SkillsResponse,
  AchievementsResponse,
  EducationResponse,
  ProjectsResponse,
} from '@/types/resume';

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  } catch {
    return dateString;
  }
}

// Helper function to format date range
function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
}

// Helper function to create skill level badge
function formatSkillLevel(level: string): string {
  const levels = {
    'beginner': '🟢',
    'intermediate': '🟡', 
    'advanced': '🔵',
    'expert': '🟣'
  };
  return levels[level.toLowerCase() as keyof typeof levels] || '⚪';
}

// Convert Profile to Markdown
export function profileToMarkdown(profile: ProfileResponse): string {
  const profileMd = json2md([
    { h1: profile.name },
    { h2: profile.title },
    { p: profile.summary },
    
    { h3: "Contact Information" },
    { p: `📧 **Email:** ${profile.email}` },
    { p: `📍 **Location:** ${profile.location}` },
    ...(profile.phone ? [{ p: `📞 **Phone:** ${profile.phone}` }] : []),
    ...(profile.linkedin ? [{ p: `💼 **LinkedIn:** [${profile.linkedin}](${profile.linkedin})` }] : []),
    ...(profile.github ? [{ p: `💻 **GitHub:** [${profile.github}](${profile.github})` }] : []),
  ]);

  return profileMd;
}

// Convert Experiences to Markdown  
export function experiencesToMarkdown(experiences: ExperiencesResponse): string {
  const experienceItems = experiences.map(exp => [
    { h2: exp.position },
    { h3: `${exp.company}` },
    { p: `**Duration:** ${formatDateRange(exp.start_date, exp.end_date)}` },
    { p: exp.description },
    
    ...(exp.highlights.length > 0 ? [
      { h4: "Key Highlights" },
      { ul: exp.highlights }
    ] : []),
    
    { hr: '' }
  ]).flat();

  const experiencesMd = json2md([
    { h1: "Professional Experience" },
    ...experienceItems
  ]);

  return experiencesMd;
}

// Convert Skills to Markdown
export function skillsToMarkdown(skills: SkillsResponse): string {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const skillItems = Object.entries(groupedSkills).map(([category, categorySkills]) => [
    { h2: category },
    { ul: categorySkills
      .sort((a, b) => a.order_index - b.order_index)
      .map(skill => 
        `${formatSkillLevel(skill.level)} **${skill.name}** - ${skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}${
          skill.is_featured ? ' ⭐' : ''
        }`
      )
    }
  ]).flat();

  const skillsMd = json2md([
    { h1: "Technical Skills" },
    ...skillItems
  ]);

  return skillsMd;
}

// Convert Achievements to Markdown
export function achievementsToMarkdown(achievements: AchievementsResponse): string {
  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryIcons = {
    'performance': '🚀',
    'architecture': '🏗️',
    'leadership': '👥',
    'innovation': '💡',
    'security': '🔒',
    'other': '⭐'
  };

  const achievementItems = Object.entries(groupedAchievements).map(([category, categoryAchievements]) => [
    { h2: `${categoryIcons[category as keyof typeof categoryIcons] || '⭐'} ${category.charAt(0).toUpperCase() + category.slice(1)}` },
    ...categoryAchievements
      .sort((a, b) => a.order_index - b.order_index)
      .map(achievement => [
        { h3: `${achievement.title}${achievement.is_featured ? ' ⭐' : ''}` },
        { p: achievement.description },
        { p: `**Impact:** ${achievement.impact_metric}` },
        { p: `**Year:** ${achievement.year_achieved}` },
      ]).flat()
  ]).flat();

  const achievementsMd = json2md([
    { h1: "Key Achievements" },
    ...achievementItems
  ]);

  return achievementsMd;
}

// Convert Education to Markdown
export function educationToMarkdown(education: EducationResponse): string {
  // Group by type (education vs certification)
  const groupedEducation = education.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Education[]>);

  const typeIcons = {
    'education': '🎓',
    'certification': '📜'
  };

  const educationItems = Object.entries(groupedEducation).map(([type, items]) => [
    { h2: `${typeIcons[type as keyof typeof typeIcons] || '📚'} ${type.charAt(0).toUpperCase() + type.slice(1)}` },
    ...items
      .sort((a, b) => a.order_index - b.order_index)
      .map(item => [
        { h3: `${item.degree_or_certification}${item.is_featured ? ' ⭐' : ''}` },
        { h4: item.institution },
        { p: `**Field:** ${item.field_of_study}` },
        { p: `**Status:** ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}` },
        ...(item.year_completed ? [{ p: `**Completed:** ${item.year_completed}` }] : []),
        ...(item.year_started && !item.year_completed ? [{ p: `**Started:** ${item.year_started}` }] : []),
        { p: item.description },
        ...(item.credential_url ? [{ p: `**More Info:** [${item.credential_url}](${item.credential_url})` }] : []),
        { hr: '' }
      ]).flat()
  ]).flat();

  const educationMd = json2md([
    { h1: "Education & Certifications" },
    ...educationItems
  ]);

  return educationMd;
}

// Convert Projects to Markdown
export function projectsToMarkdown(projects: ProjectsResponse): string {
  const projectItems = projects
    .sort((a, b) => a.order_index - b.order_index)
    .map(project => [
      { h2: `${project.name}${project.is_featured ? ' ⭐' : ''}` },
      { p: project.description },
      
      { h4: "Technologies" },
      { p: project.technologies.map(tech => `\`${tech}\``).join(', ') },
      
      { h4: "Key Features" },
      { ul: project.key_features },
      
      { h4: "Project Details" },
      { p: `**Status:** ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}` },
      { p: `**Started:** ${formatDate(project.start_date)}` },
      
      // Links section
      { h4: "Links" },
      { p: `💻 **Source Code:** [${project.github_url}](${project.github_url})` },
      
      { hr: '' }
    ]).flat();

  const projectsMd = json2md([
    { h1: "Portfolio Projects" },
    ...projectItems
  ]);

  return projectsMd;
}

// Convert single Project to Markdown
export function projectToMarkdown(project: Project): string {
  const projectMd = json2md([
    { h1: `${project.name}${project.is_featured ? ' ⭐' : ''}` },
    { p: project.description },
    
    { h3: "Technologies" },
    { p: project.technologies.map(tech => `\`${tech}\``).join(', ') },
    
    { h3: "Key Features" },
    { ul: project.key_features },
    
    { h3: "Project Details" },
    { p: `**Status:** ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}` },
    { p: `**Started:** ${formatDate(project.start_date)}` },
    
    // Links section
    { h3: "Links" },
    { p: `💻 **Source Code:** [${project.github_url}](${project.github_url})` },
  ]);

  return projectMd;
}

// Helper function to sanitize project name for file name
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Generate projects folder structure with individual files
export function generateProjectsStructure(projects: ProjectsResponse): { name: string; path: string; type: 'file'; content: string }[] {
  return projects
    .sort((a, b) => a.order_index - b.order_index)
    .map(project => {
      const fileName = sanitizeFileName(project.name) + '.md';
      return {
        name: fileName,
        path: `/neil-mulder-portfolio/src/projects/${fileName}`,
        type: 'file' as const,
        content: projectToMarkdown(project)
      };
    });
}

// Type guards for API responses
function isProfileResponse(data: unknown): data is ProfileResponse {
  return typeof data === 'object' && data !== null && 'name' in data && 'title' in data && 'email' in data;
}

function isExperiencesResponse(data: unknown): data is ExperiencesResponse {
  return Array.isArray(data) && data.length > 0 && 'company' in data[0] && 'position' in data[0];
}

function isSkillsResponse(data: unknown): data is SkillsResponse {
  return Array.isArray(data) && data.length > 0 && 'category' in data[0] && 'name' in data[0] && 'level' in data[0];
}

function isAchievementsResponse(data: unknown): data is AchievementsResponse {
  return Array.isArray(data) && data.length > 0 && 'title' in data[0] && 'description' in data[0];
}

function isEducationResponse(data: unknown): data is EducationResponse {
  return Array.isArray(data) && data.length > 0 && 'institution' in data[0];
}

function isProjectsResponse(data: unknown): data is ProjectsResponse {
  return Array.isArray(data) && data.length > 0 && 'name' in data[0] && 'description' in data[0];
}

// Main converter function that handles any response type
export function convertToMarkdown(data: unknown, fileName: string): string {
  try {
    // Determine the type based on filename and convert accordingly
    if (fileName.includes('profile.md') && isProfileResponse(data)) {
      return profileToMarkdown(data);
    }
    if (fileName.includes('experiences.md') && isExperiencesResponse(data)) {
      return experiencesToMarkdown(data);
    }
    if (fileName.includes('skills.md') && isSkillsResponse(data)) {
      return skillsToMarkdown(data);
    }
    if (fileName.includes('achievements.md') && isAchievementsResponse(data)) {
      return achievementsToMarkdown(data);
    }
    if (fileName.includes('education.md') && isEducationResponse(data)) {
      return educationToMarkdown(data);
    }
    if (fileName.includes('projects.md') && isProjectsResponse(data)) {
      return projectsToMarkdown(data);
    }
    
    // Fallback for unknown file types
    return json2md([
      { h1: fileName.replace('.md', '').toUpperCase() },
      { code: { language: 'json', content: JSON.stringify(data, null, 2) } },
      { p: '*Raw JSON response - formatter not implemented for this file type.*' }
    ]);
    
  } catch (error) {
    console.error('Error converting to markdown:', error);
    
    // Error fallback
    return json2md([
      { h1: `Error Loading ${fileName}` },
      { p: 'Failed to convert API response to markdown format.' },
      { blockquote: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { h3: 'Raw Data' },
      { code: { language: 'json', content: JSON.stringify(data, null, 2) } }
    ]);
  }
}

// Fallback content generators for when API is unavailable
export function generateFallbackContent(fileName: string): string {
  const section = fileName.replace('.md', '').toLowerCase();
  
  const fallbackContent = {
    profile: json2md([
      { h1: "Neil Mulder" },
      { h2: "Senior .NET Backend Developer" },
      { p: "Experienced Senior .NET Backend Developer with expertise in building scalable, high-performance applications. Passionate about clean code, system architecture, and modern development practices." },
      { h3: "Contact Information" },
      { p: "📧 **Email:** neil@example.com" },
      { p: "📍 **Location:** Your Location" },
      { h3: "Core Technologies" },
      { ul: ["C#", ".NET Core", "ASP.NET Core", "Entity Framework", "SQL Server", "Azure", "Docker"] },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ]),
    
    experiences: json2md([
      { h1: "Professional Experience" },
      { h2: "Senior .NET Backend Developer" },
      { h3: "Current Company | Remote" },
      { p: "**Duration:** January 2022 - Present" },
      { p: "Leading development of scalable microservices and API solutions using .NET Core and Azure cloud services." },
      { h4: "Key Responsibilities" },
      { ul: ["Architected and developed scalable microservices", "Led API design and implementation", "Mentored junior developers"] },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ]),
    
    skills: json2md([
      { h1: "Technical Skills" },
      { h2: "Programming Languages" },
      { ul: ["🟣 **C#** - Expert", "🔵 **SQL** - Advanced", "🟡 **JavaScript** - Intermediate"] },
      { h2: "Frameworks & Technologies" },
      { ul: ["🟣 **.NET Core** - Expert", "🔵 **ASP.NET Core** - Advanced", "🔵 **Entity Framework** - Advanced"] },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ]),
    
    achievements: json2md([
      { h1: "Key Achievements" },
      { h2: "🚀 Performance" },
      { h3: "System Optimization" },
      { p: "Improved API performance by 40% through database optimization and caching strategies." },
      { p: "**Impact:** 40% improvement in response times" },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ]),
    
    education: json2md([
      { h1: "Education & Certifications" },
      { h2: "Microsoft Certified: Azure Developer Associate" },
      { h3: "Microsoft" },
      { p: "**Completed:** March 2023" },
      { p: "Comprehensive certification covering Azure development, deployment, and monitoring." },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ]),
    
    projects: json2md([
      { h1: "Portfolio Projects" },
      { h2: "E-Commerce Platform" },
      { p: "Scalable e-commerce backend built with .NET Core, handling high-volume transactions." },
      { h4: "Technologies" },
      { p: "`C#`, `.NET Core`, `PostgreSQL`, `Redis`, `Docker`" },
      { h4: "Key Features" },
      { ul: ["Payment processing integration", "Real-time inventory management", "Scalable microservices architecture"] },
      { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
    ])
  };
  
  return fallbackContent[section as keyof typeof fallbackContent] || json2md([
    { h1: section.charAt(0).toUpperCase() + section.slice(1) },
    { p: "Content temporarily unavailable." },
    { blockquote: "⚠️ API temporarily unavailable. Please try again later." }
  ]);
}

// Generate fallback projects structure for when API is unavailable
export function generateFallbackProjectsStructure(): { name: string; path: string; type: 'file'; content: string }[] {
  const fallbackProjects = [
    {
      name: "E-Commerce Platform",
      content: json2md([
        { h1: "E-Commerce Platform ⭐" },
        { p: "Scalable e-commerce backend built with .NET Core, handling high-volume transactions and real-time inventory management." },
        
        { h3: "Technologies" },
        { p: "`C#`, `.NET Core`, `ASP.NET Core`, `PostgreSQL`, `Redis`, `Docker`, `Azure`" },
        
        { h3: "Key Features" },
        { ul: [
          "Payment processing integration with Stripe and PayPal",
          "Real-time inventory management system",
          "Scalable microservices architecture",
          "Automated order processing workflow",
          "Redis caching for performance optimization"
        ]},
        
        { h3: "Project Details" },
        { p: "**Status:** Completed" },
        { p: "**Started:** January 2023" },
        
        { h3: "Links" },
        { p: "💻 **Source Code:** [https://github.com/npmulder/ecommerce-platform](https://github.com/npmulder/ecommerce-platform)" },
        
        { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
      ])
    },
    {
      name: "Task Management API",
      content: json2md([
        { h1: "Task Management API" },
        { p: "RESTful API for task and project management with team collaboration features, built using modern .NET technologies." },
        
        { h3: "Technologies" },
        { p: "`C#`, `.NET 6`, `Entity Framework Core`, `SQL Server`, `JWT`, `Swagger`" },
        
        { h3: "Key Features" },
        { ul: [
          "JWT-based authentication and authorization",
          "Real-time notifications using SignalR",
          "Advanced filtering and search capabilities",
          "File upload and attachment management",
          "Comprehensive API documentation with Swagger"
        ]},
        
        { h3: "Project Details" },
        { p: "**Status:** In Progress" },
        { p: "**Started:** March 2023" },
        
        { h3: "Links" },
        { p: "💻 **Source Code:** [https://github.com/npmulder/task-management-api](https://github.com/npmulder/task-management-api)" },
        
        { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
      ])
    },
    {
      name: "Weather Dashboard",
      content: json2md([
        { h1: "Weather Dashboard" },
        { p: "Modern weather application with location-based forecasts, historical data, and interactive charts built with React and .NET." },
        
        { h3: "Technologies" },
        { p: "`React`, `TypeScript`, `C#`, `.NET Core`, `OpenWeather API`, `Chart.js`" },
        
        { h3: "Key Features" },
        { ul: [
          "Real-time weather data integration",
          "Interactive charts and visualizations",
          "Location-based weather forecasts",
          "Historical weather data analysis",
          "Responsive design for mobile and desktop"
        ]},
        
        { h3: "Project Details" },
        { p: "**Status:** Completed" },
        { p: "**Started:** December 2022" },
        
        { h3: "Links" },
        { p: "💻 **Source Code:** [https://github.com/npmulder/weather-dashboard](https://github.com/npmulder/weather-dashboard)" },
        
        { blockquote: "⚠️ API temporarily unavailable. Showing placeholder content." }
      ])
    }
  ];

  return fallbackProjects.map(project => ({
    name: sanitizeFileName(project.name) + '.md',
    path: `/neil-mulder-portfolio/src/projects/${sanitizeFileName(project.name)}.md`,
    type: 'file' as const,
    content: project.content
  }));
}