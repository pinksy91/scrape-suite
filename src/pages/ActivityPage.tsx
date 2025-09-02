import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Filter,
  Download,
  Eye,
  Server,
  Globe,
  BarChart3
} from "lucide-react";
import { mockDashboardStats, mockSites } from "@/data/mockData";

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'scrape' | 'error' | 'system' | 'config';
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
  details?: string;
  duration?: number;
  itemsFound?: number;
}

// Generate mock log entries
const generateLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  const now = new Date();
  
  // Recent activity from dashboard
  mockDashboardStats.recentActivity.forEach((activity, index) => {
    logs.push({
      id: activity.id,
      timestamp: activity.timestamp,
      type: activity.type as any,
      level: activity.status === 'success' ? 'success' : activity.status === 'error' ? 'error' : 'info',
      source: activity.type === 'scrape' ? 'Scraper Engine' : 'System',
      message: activity.message,
      details: activity.type === 'scrape' ? 'Scraping completed successfully' : undefined,
      duration: activity.type === 'scrape' ? Math.floor(Math.random() * 30) + 5 : undefined,
      itemsFound: activity.type === 'scrape' ? Math.floor(Math.random() * 50) + 10 : undefined
    });
  });

  // Generate additional logs
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const types = ['scrape', 'error', 'system', 'config'];
    const type = types[Math.floor(Math.random() * types.length)] as LogEntry['type'];
    
    let level: LogEntry['level'] = 'info';
    let message = '';
    let source = 'System';
    
    switch (type) {
      case 'scrape':
        level = Math.random() > 0.2 ? 'success' : 'error';
        source = mockSites[Math.floor(Math.random() * mockSites.length)].name;
        message = level === 'success' 
          ? `Scraping completato con successo`
          : `Errore durante il scraping: ${['Timeout', 'Rate limit exceeded', 'Invalid selector', 'Network error'][Math.floor(Math.random() * 4)]}`;
        break;
      case 'error':
        level = 'error';
        source = 'System';
        message = `Errore sistema: ${['Database connection lost', 'Memory limit exceeded', 'Invalid configuration'][Math.floor(Math.random() * 3)]}`;
        break;
      case 'system':
        level = 'info';
        source = 'System';
        message = `${['Sistema avviato', 'Backup completato', 'Cache pulita', 'Log rotated'][Math.floor(Math.random() * 4)]}`;
        break;
      case 'config':
        level = 'info';
        source = 'Config';
        message = `Configurazione aggiornata: ${['Nuovo sito aggiunto', 'Gruppo modificato', 'Rate limit cambiato'][Math.floor(Math.random() * 3)]}`;
        break;
    }

    logs.push({
      id: `log_${i}`,
      timestamp: timestamp.toISOString(),
      type,
      level,
      source,
      message,
      duration: type === 'scrape' ? Math.floor(Math.random() * 30) + 5 : undefined,
      itemsFound: type === 'scrape' && level === 'success' ? Math.floor(Math.random() * 50) + 1 : undefined
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function ActivityPage() {
  const [logs] = useState<LogEntry[]>(generateLogs());
  const [filter, setFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter !== 'all' && log.type !== filter) return false;
      if (levelFilter !== 'all' && log.level !== levelFilter) return false;
      return true;
    });
  }, [logs, filter, levelFilter]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = logs.filter(log => new Date(log.timestamp) >= today);
    const errorCount = todayLogs.filter(log => log.level === 'error').length;
    const successCount = todayLogs.filter(log => log.level === 'success').length;
    const avgDuration = logs
      .filter(log => log.duration && log.level === 'success')
      .reduce((sum, log) => sum + log.duration!, 0) / logs.filter(log => log.duration).length;

    return {
      todayTotal: todayLogs.length,
      errorCount,
      successCount,
      avgDuration: Math.round(avgDuration || 0)
    };
  }, [logs]);

  const getIcon = (log: LogEntry) => {
    switch (log.level) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    const variants = {
      success: "default",
      error: "destructive", 
      warning: "secondary",
      info: "outline"
    };
    return <Badge variant={variants[level] as any} className="text-xs">{level}</Badge>;
  };

  const exportLogs = () => {
    const csvData = filteredLogs.map(log => ({
      Timestamp: new Date(log.timestamp).toLocaleString('it-IT'),
      Tipo: log.type,
      Livello: log.level,
      Fonte: log.source,
      Messaggio: log.message,
      Durata: log.duration || '',
      Elementi: log.itemsFound || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraperhub-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Log Attività</h1>
          <p className="text-muted-foreground mt-1">
            Monitora tutte le operazioni del sistema in tempo reale
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Eventi Oggi</p>
              <p className="text-2xl font-bold">{stats.todayTotal}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Successi</p>
              <p className="text-2xl font-bold">{stats.successCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Errori</p>
              <p className="text-2xl font-bold">{stats.errorCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Durata Media</p>
              <p className="text-2xl font-bold">{stats.avgDuration}s</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gradient-surface">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtri:</span>
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i tipi</SelectItem>
              <SelectItem value="scrape">Scraping</SelectItem>
              <SelectItem value="error">Errori</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
              <SelectItem value="config">Configurazione</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i livelli</SelectItem>
              <SelectItem value="success">Successo</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Errore</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredLogs.length} di {logs.length} eventi
          </div>
        </div>
      </Card>

      {/* Logs */}
      <Card className="bg-gradient-surface">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Eventi Sistema
          </h3>
        </div>
        
        <div className="divide-y">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-surface-variant/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getIcon(log)}
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(log.timestamp).toLocaleString('it-IT')}
                    </span>
                    {getLevelBadge(log.level)}
                    <Badge variant="outline" className="text-xs">{log.type}</Badge>
                    <span className="text-sm text-muted-foreground">{log.source}</span>
                  </div>
                  
                  <p className="text-sm font-medium text-foreground mb-1">
                    {log.message}
                  </p>
                  
                  {log.details && (
                    <p className="text-xs text-muted-foreground">
                      {log.details}
                    </p>
                  )}
                  
                  {(log.duration || log.itemsFound) && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {log.duration && (
                        <span>Durata: {log.duration}s</span>
                      )}
                      {log.itemsFound && (
                        <span>Elementi trovati: {log.itemsFound}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}