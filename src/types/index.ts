export type PropertyType = 'apartment' | 'house' | 'studio' | 'room';
export type FurnishingType = 'furnished' | 'unfurnished' | 'any';

export interface Property {
  id: string;
  sourceId: string;
  sourceName: string;
  originalUrl: string;
  title: string;
  description: string;
  county: string;
  city: string;
  area: string;
  address: string;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  furnishing: FurnishingType;
  berRating?: string;
  images: string[];
  isDemo: boolean;
  publishedAt: string;
  discoveredAt: string;
  latitude: number;
  longitude: number;
  features?: string[];
  agentName?: string;
  agentPhone?: string;
  commuteInfo?: {
    luas?: string;
    dart?: string;
    bus?: string;
    walkScore?: number;
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  county: string;
  town?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number | string;
  propertyTypes: PropertyType[];
  furnishing?: FurnishingType;
  keywords?: string;
  isActive: boolean;
  notifyTelegram: boolean;
  notifyEmail: boolean;
  matchesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  notes?: string;
  savedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  searchId?: string;
  searchName?: string;
  propertyId: string;
  propertyTitle: string;
  propertyRent: number;
  propertyLocation: string;
  propertyType: PropertyType;
  propertyImage?: string;
  matchScore: number;
  matchReason: string;
  isRead: boolean;
  telegramSent: boolean;
  createdAt: string;
  property?: Property;
}

export interface MonitoringSource {
  id: string;
  name: string;
  type: 'mock_feed' | 'rss' | 'api_connector' | 'feed_sim';
  url: string;
  status: 'active' | 'paused' | 'error' | 'degraded';
  pollIntervalMinutes: number;
  lastCheckedAt: string;
  propertiesFound: number;
  errorCount: number;
  lastError?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  telegramChatId?: string;
  telegramConnected: boolean;
  emailNotifications: boolean;
  instantAlerts: boolean;
  dailySummary: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FilterState {
  county: string;
  town: string;
  minRent: number | '';
  maxRent: number | '';
  bedrooms: string;
  propertyType: string;
  furnishing: string;
  keywords: string;
  sortBy: 'newest' | 'rent_asc' | 'rent_desc' | 'match';
}

export interface SystemStats {
  totalDiscovered: number;
  newToday: number;
  matchesCount: number;
  savedCount: number;
  activeSources: number;
  totalSources: number;
  lastScanTimestamp: string;
  notificationsDispatched: number;
  engineStatus: 'running' | 'idle' | 'warning';
}

export interface AIMatchResult {
  score: number;
  explanation: string;
  pros: string[];
  cons: string[];
  estimatedDemandScore?: 'Extreme' | 'High' | 'Moderate';
  marketRentComparison?: string;
}
