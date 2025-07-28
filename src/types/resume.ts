// TypeScript interfaces for Resume API responses

export interface Profile {
  id: number;
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  description: string;
  highlights: string[];
  order_index: number;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  impact_metric: string;
  year_achieved: number;
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree_or_certification: string;
  field_of_study: string;
  year_started?: number;
  year_completed?: number;
  description: string;
  type: 'education' | 'certification';
  status: 'completed' | 'in_progress';
  credential_id: string;
  credential_url: string;
  order_index: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  degree_title: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  short_description: string;
  technologies: string[];
  github_url: string;
  start_date: string;
  status: string;
  is_featured: boolean;
  order_index: number;
  key_features: string[];
  created_at: string;
  updated_at: string;
}

// API Response types (direct responses, not wrapped)
export type ProfileResponse = Profile;
export type ExperiencesResponse = Experience[];
export type SkillsResponse = Skill[];
export type AchievementsResponse = Achievement[];
export type EducationResponse = Education[];
export type ProjectsResponse = Project[];

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Error response type
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}