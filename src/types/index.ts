export interface Site {
  id: string;
  name: string;
  baseUrl: string;
  groups: string[];
  enabled: boolean;
  jsRender: boolean;
  rateLimitRps: number;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  notes?: string;
  extractRules: ExtractRules;
  pagination?: PaginationConfig;
  lastRunAt?: string;
  lastStatus?: 'success' | 'error' | 'running';
  successCount: number;
  errorCount: number;
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ScrapedItem {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  groupIds: string[];
  category?: string;
  tags: string[];
  available: boolean;
  createdAt: string;
  scrapedAt: string;
}

export interface ExtractRules {
  listPaths: string[];
  itemSelector: string;
  fields: Record<string, FieldRule>;
  pagination?: PaginationConfig;
  fallbacks?: {
    jsonld?: boolean;
    opengraph?: boolean;
    twitter?: boolean;
  };
}

export interface FieldRule {
  type: 'css' | 'image_auto' | 'detect_currency' | 'css_or_text_presence';
  expr?: string;
  exprs?: string[];
  transform?: string;
  filters?: string[];
  choose?: string;
  normalize?: {
    regex?: string;
    decimal_sep_auto?: boolean;
  };
  map?: Record<string, string>;
  truthy?: string[];
  falsy?: string[];
  fallback?: string;
}

export interface PaginationConfig {
  strategy: 'url_template' | 'selector_next';
  maxPages?: number;
  param?: string;
  start?: number;
}

export interface SearchFilters {
  query?: string;
  groups?: string[];
  category?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  available?: boolean;
  source?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
}

export interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalItems: number;
  itemsToday: number;
  successRate: number;
  avgResponseTime: number;
  topGroups: Array<{ name: string; count: number; }>;
  recentActivity: Array<{
    id: string;
    type: 'scrape' | 'error' | 'new_site' | 'new_group';
    message: string;
    timestamp: string;
    status?: 'success' | 'error' | 'warning';
  }>;
}