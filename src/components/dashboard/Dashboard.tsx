import { StatCard } from "./StatCard";
import { ItemCard } from "../results/ItemCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Database, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Plus,
  RefreshCw
} from "lucide-react";
import { mockDashboardStats, mockItems, mockSites } from "@/data/mockData";

export function Dashboard() {
  const stats = mockDashboardStats;
  const recentItems = mockItems.slice(0, 6);
  const activeSites = mockSites.filter(site => site.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Panoramica delle attività di scraping e risultati
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Sito
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Siti Totali"
          value={stats.totalSites}
          description={`${stats.activeSites} attivi`}
          icon={Globe}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Elementi Totali"
          value={stats.totalItems.toLocaleString()}
          description={`+${stats.itemsToday} oggi`}
          icon={Database}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Successo Rate"
          value={`${stats.successRate}%`}
          description="Ultimi 30 giorni"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
        />
        
        <StatCard
          title="Tempo Medio"
          value={`${stats.avgResponseTime}s`}
          description="Risposta scraping"
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 bg-gradient-surface border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Attività Recenti
            </h3>
            <Button variant="outline" size="sm">Vedi tutto</Button>
          </div>
          
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-variant/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'error' ? 'bg-destructive' :
                  'bg-warning'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString('it-IT')}
                  </p>
                </div>
                {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
                {activity.status === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
                {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Sites Status */}
        <Card className="p-6 bg-gradient-surface border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Stato Siti
            </h3>
            <Button variant="outline" size="sm">Gestisci</Button>
          </div>
          
          <div className="space-y-4">
            {mockSites.map((site) => (
              <div key={site.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    site.enabled && site.lastStatus === 'success' ? 'bg-success' :
                    site.enabled && site.lastStatus === 'error' ? 'bg-destructive' :
                    site.enabled ? 'bg-warning' : 'bg-muted'
                  }`} />
                  <div>
                    <p className="font-medium text-sm text-foreground">{site.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {site.enabled ? `${site.successCount} successi` : 'Disabilitato'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    Success rate: {((site.successCount / (site.successCount + site.errorCount)) * 100).toFixed(1)}%
                  </div>
                  <Progress 
                    value={(site.successCount / (site.successCount + site.errorCount)) * 100} 
                    className="w-16 h-2 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Groups */}
      <Card className="p-6 bg-gradient-surface border-card-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Gruppi più Popolari</h3>
          <Button variant="outline" size="sm">Vedi tutti i gruppi</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.topGroups.map((group, index) => (
            <div key={group.name} className="p-4 rounded-lg bg-surface-variant/50 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{group.name}</h4>
                <span className="text-xs text-muted-foreground">#{index + 1}</span>
              </div>
              <p className="text-2xl font-bold text-primary">{group.count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">elementi trovati</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ultimi Risultati</h3>
          <Button variant="outline" size="sm">Vedi tutti</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item}
              onImageClick={(item) => console.log('Opening:', item.sourceUrl)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}