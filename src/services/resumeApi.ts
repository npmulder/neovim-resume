import {
  ProfileResponse,
  ExperiencesResponse,
  SkillsResponse,
  AchievementsResponse,
  EducationResponse,
  ProjectsResponse,
  ApiError,
} from '@/types/resume';

const API_BASE_URL = 'https://resume-api.npmulder.dev';

// API endpoints mapping
const ENDPOINTS = {
  profile: `${API_BASE_URL}/api/v1/profile`,
  experiences: `${API_BASE_URL}/api/v1/experiences`,
  skills: `${API_BASE_URL}/api/v1/skills`,
  achievements: `${API_BASE_URL}/api/v1/achievements`,
  education: `${API_BASE_URL}/api/v1/education`,
  projects: `${API_BASE_URL}/api/v1/projects`,
} as const;

// Types for endpoint keys
export type EndpointKey = keyof typeof ENDPOINTS;

// Response type mapping
type ResponseTypeMap = {
  profile: ProfileResponse;
  experiences: ExperiencesResponse;
  skills: SkillsResponse;
  achievements: AchievementsResponse;
  education: EducationResponse;
  projects: ProjectsResponse;
};

// Custom error class for API errors
export class ResumeApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ResumeApiError';
  }
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Exponential backoff delay calculation
function calculateDelay(attempt: number): number {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
}

// Generic fetch with retry logic
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  attempt = 0
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ResumeApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url
      );
    }

    const data = await response.json();
    return data as T;

  } catch (error) {
    // If this is the last attempt or it's not a network error, throw
    if (attempt >= RETRY_CONFIG.maxRetries || 
        (error instanceof ResumeApiError && error.statusCode < 500)) {
      throw error;
    }

    // Wait before retrying
    const delay = calculateDelay(attempt);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry
    return fetchWithRetry<T>(url, options, attempt + 1);
  }
}

// Generic API call function
async function apiCall<K extends EndpointKey>(
  endpoint: K
): Promise<ResponseTypeMap[K]> {
  const url = ENDPOINTS[endpoint];
  
  try {
    return await fetchWithRetry<ResponseTypeMap[K]>(url);
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Specific API functions
export const resumeApi = {
  // Get profile data
  getProfile: (): Promise<ProfileResponse> => apiCall('profile'),
  
  // Get experiences data
  getExperiences: (): Promise<ExperiencesResponse> => apiCall('experiences'),
  
  // Get skills data
  getSkills: (): Promise<SkillsResponse> => apiCall('skills'),
  
  // Get achievements data
  getAchievements: (): Promise<AchievementsResponse> => apiCall('achievements'),
  
  // Get education data
  getEducation: (): Promise<EducationResponse> => apiCall('education'),
  
  // Get projects data
  getProjects: (): Promise<ProjectsResponse> => apiCall('projects'),
  
  // Get data by file path (for Editor component)
  getDataByPath: async (filePath: string): Promise<unknown> => {
    if (filePath.includes('profile.md')) return resumeApi.getProfile();
    if (filePath.includes('experiences.md')) return resumeApi.getExperiences();
    if (filePath.includes('skills.md')) return resumeApi.getSkills();
    if (filePath.includes('achievements.md')) return resumeApi.getAchievements();
    if (filePath.includes('education.md')) return resumeApi.getEducation();
    if (filePath.includes('projects.md')) return resumeApi.getProjects();
    
    throw new ResumeApiError(
      `No API endpoint found for path: ${filePath}`,
      404,
      filePath
    );
  },
};

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    // Try to fetch profile as a health check
    await resumeApi.getProfile();
    return true;
  } catch {
    return false;
  }
}

// Check if error is a network error (for offline detection)
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  if (error instanceof ResumeApiError && error.statusCode === 0) {
    return true;
  }
  return false;
}