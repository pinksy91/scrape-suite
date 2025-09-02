import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Globe, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity
} from "lucide-react";
import { mockSites, mockGroups } from "@/data/mockData";
import { Site } from "@/types";

export function SitesManagement() {
  const [sites, setSites] = useState(mockSites);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getStatusIcon = (site: Site) => {
    if (!site.enabled) return <Pause className="w-4 h-4 text-muted-foreground" />;
    switch (site.lastStatus) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running': return <Activity className="w-4 h-4 text-warning animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (site: Site) => {
    if (!site.enabled) return "secondary";
    switch (site.lastStatus) {
      case 'success': return "default";
      case 'error': return "destructive";
      case 'running': return "secondary";
      default: return "outline";
    }
  };

  const toggleSite = (siteId: string) => {
    setSites(prev => prev.map(site => 
      site.id === siteId ? { ...site, enabled: !site.enabled } : site
    ));
  };

  const runScraping = (siteId: string) => {
    setSites(prev => prev.map(site => 
      site.id === siteId ? { 
        ...site, 
        lastStatus: 'running' as const,
        lastRunAt: new Date().toISOString()
      } : site
    ));
    
    // Simulate scraping completion
    setTimeout(() => {
      setSites(prev => prev.map(site => 
        site.id === siteId ? { 
          ...site, 
          lastStatus: Math.random() > 0.2 ? 'success' : 'error' as const,
          successCount: site.successCount + (Math.random() > 0.2 ? Math.floor(Math.random() * 20) + 1 : 0),
          errorCount: site.errorCount + (Math.random() > 0.2 ? 0 : 1)
        } : site
      ));
    }, 3000);
  };

  const SiteForm = ({ site, onSave, onClose }: { 
    site?: Site; 
    onSave: (site: Partial<Site>) => void; 
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: site?.name || "",
      baseUrl: site?.baseUrl || "",
      groups: site?.groups || [],
      enabled: site?.enabled ?? true,
      jsRender: site?.jsRender ?? false,
      rateLimitRps: site?.rateLimitRps || 2,
      notes: site?.notes || ""
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Sito</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Es. TechShop Italia"
            required
          />
        </div>

        <div>
          <Label htmlFor="baseUrl">URL Base</Label>
          <Input
            id="baseUrl"
            type="url"
            value={formData.baseUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="groups">Gruppi</Label>
          <Select 
            value={formData.groups[0] || ""} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, groups: [value] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona gruppi" />
            </SelectTrigger>
            <SelectContent>
              {mockGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
          />
          <Label htmlFor="enabled">Sito attivo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="jsRender"
            checked={formData.jsRender}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, jsRender: checked }))}
          />
          <Label htmlFor="jsRender">Rendering JavaScript</Label>
        </div>

        <div>
          <Label htmlFor="rateLimitRps">Rate Limit (req/sec)</Label>
          <Input
            id="rateLimitRps"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={formData.rateLimitRps}
            onChange={(e) => setFormData(prev => ({ ...prev, rateLimitRps: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="notes">Note</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Note aggiuntive sul sito..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {site ? "Aggiorna Sito" : "Aggiungi Sito"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Annulla
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestione Siti</h1>
          <p className="text-muted-foreground mt-1">
            Configura e monitora i siti di scraping ({sites.length} totali)
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Sito
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Aggiungi Nuovo Sito</DialogTitle>
            </DialogHeader>
            <SiteForm 
              onSave={(data) => {
                const newSite: Site = {
                  ...data,
                  id: String(sites.length + 1),
                  extractRules: {
                    listPaths: [],
                    itemSelector: '',
                    fields: {}
                  },
                  successCount: 0,
                  errorCount: 0
                } as Site;
                setSites(prev => [...prev, newSite]);
              }}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Siti Totali</p>
              <p className="text-2xl font-bold">{sites.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Siti Attivi</p>
              <p className="text-2xl font-bold">{sites.filter(s => s.enabled).length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">In Esecuzione</p>
              <p className="text-2xl font-bold">{sites.filter(s => s.lastStatus === 'running').length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Con Errori</p>
              <p className="text-2xl font-bold">{sites.filter(s => s.lastStatus === 'error').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sites List */}
      <div className="grid gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="p-6 bg-gradient-surface border-card-border hover:shadow-medium transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(site)}
                  <h3 className="text-lg font-semibold text-foreground">{site.name}</h3>
                  <Badge variant={getStatusColor(site) as any} className="text-xs">
                    {site.enabled ? (site.lastStatus || 'idle') : 'disabilitato'}
                  </Badge>
                  {site.jsRender && (
                    <Badge variant="outline" className="text-xs">JS</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{site.baseUrl}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Gruppi: </span>
                    <span className="font-medium">
                      {site.groups.map(groupId => {
                        const group = mockGroups.find(g => g.id === groupId);
                        return group?.name;
                      }).filter(Boolean).join(", ") || "Nessuno"}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Rate Limit: </span>
                    <span className="font-medium">{site.rateLimitRps} req/s</span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Successi: </span>
                    <span className="font-medium text-success">{site.successCount}</span>
                    <span className="text-muted-foreground"> / Errori: </span>
                    <span className="font-medium text-destructive">{site.errorCount}</span>
                  </div>
                </div>
                
                {site.notes && (
                  <p className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded">
                    {site.notes}
                  </p>
                )}
                
                {site.lastRunAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Ultima esecuzione: {new Date(site.lastRunAt).toLocaleString('it-IT')}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleSite(site.id)}
                  className="w-9 h-9 p-0"
                >
                  {site.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runScraping(site.id)}
                  disabled={!site.enabled || site.lastStatus === 'running'}
                  className="w-9 h-9 p-0"
                >
                  <TestTube className="w-4 h-4" />
                </Button>
                
                <Dialog open={isEditDialogOpen && selectedSite?.id === site.id} onOpenChange={(open) => {
                  setIsEditDialogOpen(open);
                  if (!open) setSelectedSite(null);
                }}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSite(site)}
                      className="w-9 h-9 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifica Sito</DialogTitle>
                    </DialogHeader>
                    <SiteForm 
                      site={selectedSite || undefined}
                      onSave={(data) => {
                        setSites(prev => prev.map(s => 
                          s.id === selectedSite?.id ? { ...s, ...data } : s
                        ));
                      }}
                      onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedSite(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSites(prev => prev.filter(s => s.id !== site.id))}
                  className="w-9 h-9 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sites.length === 0 && (
        <Card className="p-12 text-center bg-gradient-surface">
          <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nessun sito configurato</h3>
          <p className="text-muted-foreground mb-4">
            Aggiungi il primo sito per iniziare lo scraping automatizzato.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Primo Sito
          </Button>
        </Card>
      )}
    </div>
  );
}