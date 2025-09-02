import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Globe, 
  Database, 
  Bell, 
  Shield, 
  Zap,
  Save,
  RotateCcw,
  AlertTriangle
} from "lucide-react";

interface SystemSettings {
  // General
  appName: string;
  maxConcurrentScrapers: number;
  defaultRateLimit: number;
  autoRetryFailed: boolean;
  retryAttempts: number;
  
  // Database
  cleanupOldResults: boolean;
  maxResultsAge: number;
  enableCompression: boolean;
  
  // Notifications
  enableEmailNotifications: boolean;
  emailAddress: string;
  notifyOnErrors: boolean;
  notifyOnSuccess: boolean;
  
  // Security
  enableApiKey: boolean;
  apiKey: string;
  allowedIpAddresses: string;
  rateLimitGlobal: number;
  
  // Advanced
  userAgent: string;
  proxyEnabled: boolean;
  proxyUrl: string;
  jsTimeout: number;
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    appName: "ScraperHub Pro",
    maxConcurrentScrapers: 3,
    defaultRateLimit: 2,
    autoRetryFailed: true,
    retryAttempts: 3,
    
    cleanupOldResults: true,
    maxResultsAge: 30,
    enableCompression: true,
    
    enableEmailNotifications: false,
    emailAddress: "",
    notifyOnErrors: true,
    notifyOnSuccess: false,
    
    enableApiKey: true,
    apiKey: "sk-1234567890abcdef",
    allowedIpAddresses: "127.0.0.1,::1",
    rateLimitGlobal: 100,
    
    userAgent: "ScraperHub Pro/1.0 (+https://scraperhub.example.com)",
    proxyEnabled: false,
    proxyUrl: "",
    jsTimeout: 30
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulate saving settings
    console.log("Saving settings:", settings);
    setHasChanges(false);
    
    // Show success message (could use toast)
    alert("Impostazioni salvate correttamente!");
  };

  const resetSettings = () => {
    if (confirm("Sei sicuro di voler ripristinare le impostazioni predefinite?")) {
      // Reset to defaults
      setSettings({
        appName: "ScraperHub Pro",
        maxConcurrentScrapers: 3,
        defaultRateLimit: 2,
        autoRetryFailed: true,
        retryAttempts: 3,
        cleanupOldResults: true,
        maxResultsAge: 30,
        enableCompression: true,
        enableEmailNotifications: false,
        emailAddress: "",
        notifyOnErrors: true,
        notifyOnSuccess: false,
        enableApiKey: true,
        apiKey: "sk-1234567890abcdef",
        allowedIpAddresses: "127.0.0.1,::1",
        rateLimitGlobal: 100,
        userAgent: "ScraperHub Pro/1.0 (+https://scraperhub.example.com)",
        proxyEnabled: false,
        proxyUrl: "",
        jsTimeout: 30
      });
      setHasChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Impostazioni</h1>
          <p className="text-muted-foreground mt-1">
            Configura il comportamento globale di ScraperHub Pro
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Ripristina
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasChanges}
            className="bg-gradient-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            Salva Modifiche
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="p-4 border-warning bg-warning/5">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Hai modifiche non salvate. Ricorda di salvare prima di uscire.
            </span>
          </div>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Generale
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifiche
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sicurezza
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Avanzate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6 bg-gradient-surface">
            <h3 className="text-lg font-semibold mb-4">Impostazioni Generali</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="appName">Nome Applicazione</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => updateSetting('appName', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxConcurrent">Scraper Simultanei</Label>
                  <Input
                    id="maxConcurrent"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxConcurrentScrapers}
                    onChange={(e) => updateSetting('maxConcurrentScrapers', Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Numero massimo di scraper attivi contemporaneamente
                  </p>
                </div>

                <div>
                  <Label htmlFor="defaultRate">Rate Limit Predefinito (req/s)</Label>
                  <Input
                    id="defaultRate"
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={settings.defaultRateLimit}
                    onChange={(e) => updateSetting('defaultRateLimit', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Riprova Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Riprova automaticamente le operazioni fallite
                  </p>
                </div>
                <Switch
                  checked={settings.autoRetryFailed}
                  onCheckedChange={(checked) => updateSetting('autoRetryFailed', checked)}
                />
              </div>

              {settings.autoRetryFailed && (
                <div>
                  <Label htmlFor="retryAttempts">Tentativi di Retry</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.retryAttempts}
                    onChange={(e) => updateSetting('retryAttempts', Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="p-6 bg-gradient-surface">
            <h3 className="text-lg font-semibold mb-4">Gestione Database</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Pulizia Automatica</Label>
                  <p className="text-sm text-muted-foreground">
                    Rimuovi automaticamente i risultati vecchi
                  </p>
                </div>
                <Switch
                  checked={settings.cleanupOldResults}
                  onCheckedChange={(checked) => updateSetting('cleanupOldResults', checked)}
                />
              </div>

              {settings.cleanupOldResults && (
                <div>
                  <Label htmlFor="maxAge">Mantieni Risultati per (giorni)</Label>
                  <Input
                    id="maxAge"
                    type="number"
                    min="7"
                    max="365"
                    value={settings.maxResultsAge}
                    onChange={(e) => updateSetting('maxResultsAge', Number(e.target.value))}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compressione Dati</Label>
                  <p className="text-sm text-muted-foreground">
                    Comprimi i dati per risparmiare spazio
                  </p>
                </div>
                <Switch
                  checked={settings.enableCompression}
                  onCheckedChange={(checked) => updateSetting('enableCompression', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6 bg-gradient-surface">
            <h3 className="text-lg font-semibold mb-4">Notifiche Email</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Abilita Notifiche Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Ricevi notifiche via email per eventi importanti
                  </p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                />
              </div>

              {settings.enableEmailNotifications && (
                <>
                  <div>
                    <Label htmlFor="email">Indirizzo Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.emailAddress}
                      onChange={(e) => updateSetting('emailAddress', e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Notifica per Errori</Label>
                      <Switch
                        checked={settings.notifyOnErrors}
                        onCheckedChange={(checked) => updateSetting('notifyOnErrors', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Notifica per Successi</Label>
                      <Switch
                        checked={settings.notifyOnSuccess}
                        onCheckedChange={(checked) => updateSetting('notifyOnSuccess', checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6 bg-gradient-surface">
            <h3 className="text-lg font-semibold mb-4">Sicurezza e Accesso</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Abilita API Key</Label>
                  <p className="text-sm text-muted-foreground">
                    Richiedi autenticazione API per accessi esterni
                  </p>
                </div>
                <Switch
                  checked={settings.enableApiKey}
                  onCheckedChange={(checked) => updateSetting('enableApiKey', checked)}
                />
              </div>

              {settings.enableApiKey && (
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      value={settings.apiKey}
                      onChange={(e) => updateSetting('apiKey', e.target.value)}
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm">
                      Genera
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="allowedIps">Indirizzi IP Consentiti</Label>
                <Textarea
                  id="allowedIps"
                  value={settings.allowedIpAddresses}
                  onChange={(e) => updateSetting('allowedIpAddresses', e.target.value)}
                  placeholder="192.168.1.1,10.0.0.1"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separati da virgola. Lascia vuoto per permettere tutti gli IP.
                </p>
              </div>

              <div>
                <Label htmlFor="globalRate">Rate Limit Globale (req/min)</Label>
                <Input
                  id="globalRate"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.rateLimitGlobal}
                  onChange={(e) => updateSetting('rateLimitGlobal', Number(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className="p-6 bg-gradient-surface">
            <h3 className="text-lg font-semibold mb-4">Impostazioni Avanzate</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="userAgent">User Agent</Label>
                <Input
                  id="userAgent"
                  value={settings.userAgent}
                  onChange={(e) => updateSetting('userAgent', e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  User Agent utilizzato per le richieste HTTP
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Abilita Proxy</Label>
                  <p className="text-sm text-muted-foreground">
                    Usa un proxy per le richieste di scraping
                  </p>
                </div>
                <Switch
                  checked={settings.proxyEnabled}
                  onCheckedChange={(checked) => updateSetting('proxyEnabled', checked)}
                />
              </div>

              {settings.proxyEnabled && (
                <div>
                  <Label htmlFor="proxyUrl">URL Proxy</Label>
                  <Input
                    id="proxyUrl"
                    value={settings.proxyUrl}
                    onChange={(e) => updateSetting('proxyUrl', e.target.value)}
                    placeholder="http://proxy.example.com:8080"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="jsTimeout">Timeout JavaScript (secondi)</Label>
                <Input
                  id="jsTimeout"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.jsTimeout}
                  onChange={(e) => updateSetting('jsTimeout', Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo massimo di attesa per il rendering JavaScript
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}