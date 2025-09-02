import { Site, Group, ScrapedItem, DashboardStats } from '@/types';

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Elettronica',
    slug: 'elettronica',
    description: 'Smartphone, computer, gadget tech',
    color: '#3b82f6'
  },
  {
    id: '2',
    name: 'Viaggi',
    slug: 'viaggi',
    description: 'Voli, hotel, pacchetti vacanza',
    color: '#10b981'
  },
  {
    id: '3',
    name: 'Audio',
    slug: 'audio',
    description: 'Cuffie, altoparlanti, impianti hi-fi',
    color: '#8b5cf6'
  },
  {
    id: '4',
    name: 'Deals',
    slug: 'deals',
    description: 'Offerte e sconti speciali',
    color: '#f59e0b'
  },
  {
    id: '5',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Abbigliamento e accessori',
    color: '#ef4444'
  }
];

export const mockSites: Site[] = [
  {
    id: '1',
    name: 'TechShop',
    baseUrl: 'https://techshop.example.com',
    groups: ['1', '3'],
    enabled: true,
    jsRender: false,
    rateLimitRps: 2,
    notes: 'Principale e-commerce tech italiano',
    extractRules: {
      listPaths: ['https://techshop.example.com/products?page={page}'],
      itemSelector: 'div.product-card',
      fields: {
        title: { type: 'css', expr: '.title::text' },
        url: { type: 'css', expr: '.title a::attr(href)', transform: 'urljoin' },
        image: {
          type: 'image_auto',
          exprs: ['img::attr(data-srcset)', 'img::attr(src)'],
          filters: ['!placeholder', '!sprite'],
          choose: 'largest_srcset_or_src'
        },
        price: {
          type: 'css',
          expr: '.price::text',
          normalize: { regex: '([0-9]+[\\.,][0-9]{2})', decimal_sep_auto: true }
        },
        currency: { type: 'detect_currency', map: { '€': 'EUR', '$': 'USD' } }
      }
    },
    lastRunAt: new Date(Date.now() - 3600000).toISOString(),
    lastStatus: 'success',
    successCount: 1247,
    errorCount: 23
  },
  {
    id: '2',
    name: 'TravelDeals',
    baseUrl: 'https://traveldeals.example.com',
    groups: ['2', '4'],
    enabled: true,
    jsRender: true,
    rateLimitRps: 1,
    notes: 'Richiede JS rendering per prezzi dinamici',
    extractRules: {
      listPaths: ['https://traveldeals.example.com/offers?page={page}'],
      itemSelector: '.travel-offer',
      fields: {
        title: { type: 'css', expr: 'h3.offer-title::text' },
        url: { type: 'css', expr: 'a.offer-link::attr(href)', transform: 'urljoin' },
        image: {
          type: 'image_auto',
          exprs: ['.offer-image img::attr(src)'],
          choose: 'largest_srcset_or_src'
        },
        price: {
          type: 'css',
          expr: '.price-final::text',
          normalize: { regex: '([0-9]+)', decimal_sep_auto: true }
        }
      }
    },
    lastRunAt: new Date(Date.now() - 7200000).toISOString(),
    lastStatus: 'error',
    successCount: 892,
    errorCount: 45
  },
  {
    id: '3',
    name: 'AudioPro',
    baseUrl: 'https://audiopro.example.com',
    groups: ['1', '3'],
    enabled: false,
    jsRender: false,
    rateLimitRps: 3,
    notes: 'Temporaneamente disabilitato per manutenzione',
    extractRules: {
      listPaths: ['https://audiopro.example.com/catalog?p={page}'],
      itemSelector: '.audio-product',
      fields: {
        title: { type: 'css', expr: '.product-name::text' },
        url: { type: 'css', expr: 'a::attr(href)', transform: 'urljoin' },
        image: { type: 'image_auto', exprs: ['img::attr(src)'] },
        price: { type: 'css', expr: '.current-price::text' }
      }
    },
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
    lastStatus: 'error',
    successCount: 534,
    errorCount: 12
  }
];

export const mockItems: ScrapedItem[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Ultimo iPhone con chip A17 Pro, fotocamera avanzata e design in titanio',
    price: 1299.99,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    sourceUrl: 'https://techshop.example.com/iphone-15-pro-max',
    sourceName: 'TechShop',
    groupIds: ['1'],
    category: 'smartphone',
    tags: ['apple', 'ios', 'premium'],
    available: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    scrapedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: '2',
    title: 'Volo Milano-Barcellona A/R',
    description: 'Volo diretto con Vueling, bagaglio incluso, date flessibili',
    price: 189.50,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=400&fit=crop',
    sourceUrl: 'https://traveldeals.example.com/milan-barcelona',
    sourceName: 'TravelDeals',
    groupIds: ['2', '4'],
    category: 'voli',
    tags: ['europa', 'weekend', 'offerta'],
    available: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    scrapedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Sony WH-1000XM5 Cuffie',
    description: 'Cuffie wireless con cancellazione attiva del rumore di ultima generazione',
    price: 299.99,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    sourceUrl: 'https://audiopro.example.com/sony-wh1000xm5',
    sourceName: 'AudioPro',
    groupIds: ['1', '3'],
    category: 'audio',
    tags: ['sony', 'wireless', 'noise-cancelling'],
    available: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    scrapedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'MacBook Air M2 13" 256GB',
    description: 'Laptop ultra-sottile con chip Apple M2, perfetto per produttività e creatività',
    price: 1149.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    sourceUrl: 'https://techshop.example.com/macbook-air-m2',
    sourceName: 'TechShop',
    groupIds: ['1'],
    category: 'computer',
    tags: ['apple', 'laptop', 'M2'],
    available: true,
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    scrapedAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '5',
    title: 'Weekend Roma - Hotel 4⭐',
    description: 'Due notti in hotel centrale, colazione inclusa, vicino al Colosseo',
    price: 245.00,
    currency: 'EUR',
    imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=400&fit=crop',
    sourceUrl: 'https://traveldeals.example.com/rome-weekend',
    sourceName: 'TravelDeals',
    groupIds: ['2', '4'],
    category: 'hotel',
    tags: ['italia', 'weekend', 'centro-storico'],
    available: true,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    scrapedAt: new Date(Date.now() - 14400000).toISOString()
  }
];

export const mockDashboardStats: DashboardStats = {
  totalSites: 3,
  activeSites: 2,
  totalItems: 2847,
  itemsToday: 156,
  successRate: 94.2,
  avgResponseTime: 1.8,
  topGroups: [
    { name: 'Elettronica', count: 1247 },
    { name: 'Viaggi', count: 892 },
    { name: 'Audio', count: 534 },
    { name: 'Deals', count: 174 }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'scrape',
      message: 'TechShop: 45 nuovi prodotti trovati',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'success'
    },
    {
      id: '2',
      type: 'error',
      message: 'TravelDeals: Errore timeout durante scraping',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'error'
    },
    {
      id: '3',
      type: 'scrape',
      message: 'AudioPro: 12 prodotti aggiornati',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'success'
    },
    {
      id: '4',
      type: 'new_group',
      message: 'Nuovo gruppo "Fashion" creato',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'success'
    }
  ]
};