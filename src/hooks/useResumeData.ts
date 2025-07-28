import { useState, useEffect, useCallback } from 'react';
import { resumeApi, ResumeApiError, isNetworkError } from '@/services/resumeApi';

// Generic hook state interface
interface UseResumeDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  retry: () => void;
}

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<unknown>>();

// Generic hook for fetching resume data
function useResumeData<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  fallbackData?: T
): UseResumeDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Check if cached data is still valid
  const getCachedData = useCallback((): T | null => {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    return null;
  }, [cacheKey]);

  // Cache data
  const setCachedData = useCallback((newData: T) => {
    const now = Date.now();
    cache.set(cacheKey, {
      data: newData,
      timestamp: now,
      expiresAt: now + CACHE_DURATION,
    });
  }, [cacheKey]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsOffline(false);

      // Try to get cached data first
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const result = await apiCall();
      setData(result);
      setCachedData(result);
      
    } catch (err) {
      console.error(`Error fetching ${cacheKey}:`, err);
      
      // Handle different types of errors
      if (isNetworkError(err)) {
        setIsOffline(true);
        setError('Network connection lost. Please check your internet connection.');
      } else if (err instanceof ResumeApiError) {
        setError(`API Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred while loading data.');
      }

      // Try to use cached data as fallback (even if expired)
      const expiredCache = cache.get(cacheKey);
      if (expiredCache) {
        setData(expiredCache.data);
        setError(prev => `${prev} Showing cached data.`);
      } else if (fallbackData) {
        setData(fallbackData);
        setError(prev => `${prev} Showing fallback data.`);
      }
      
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, getCachedData, setCachedData, fallbackData]);

  // Retry function
  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Effect to fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isOffline,
    retry,
  };
}

// Specific hooks for each data type
export function useProfile() {
  return useResumeData(
    resumeApi.getProfile,
    'profile'
  );
}

export function useExperiences() {
  return useResumeData(
    resumeApi.getExperiences,
    'experiences'
  );
}

export function useSkills() {
  return useResumeData(
    resumeApi.getSkills,
    'skills'
  );
}

export function useAchievements() {
  return useResumeData(
    resumeApi.getAchievements,
    'achievements'
  );
}

export function useEducation() {
  return useResumeData(
    resumeApi.getEducation,
    'education'
  );
}

export function useProjects() {
  return useResumeData(
    resumeApi.getProjects,
    'projects'
  );
}

// Hook for getting data by file path (for Editor component)
export function useResumeDataByPath(filePath: string) {
  const apiCall = useCallback(() => resumeApi.getDataByPath(filePath), [filePath]);
  
  return useResumeData(
    apiCall,
    `path_${filePath}`
  );
}

// Hook for checking API health
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      await resumeApi.getProfile();
      setIsHealthy(true);
    } catch {
      setIsHealthy(false);
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    lastChecked,
    checkHealth,
  };
}

// Clear cache function (useful for development)
export function clearResumeCache() {
  cache.clear();
}