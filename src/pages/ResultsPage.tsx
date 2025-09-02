import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemCard } from "@/components/results/ItemCard";
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  Euro,
  Calendar
} from "lucide-react";
import { mockItems, mockGroups, mockSites } from "@/data/mockData";
import { SearchFilters } from "@/types";

export function ResultsPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    groups: [],
    sortBy: "date_desc"
  });

  // Enhanced filtering and sorting
  const filteredItems = useMemo(() => {
    let items = [...mockItems];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.sourceName.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Group filter
    if (filters.groups && filters.groups.length > 0) {
      items = items.filter(item => 
        item.groupIds.some(groupId => filters.groups!.includes(groupId))
      );
    }

    // Source filter
    if (filters.source) {
      items = items.filter(item => item.sourceName === filters.source);
    }

    // Availability filter
    if (filters.available !== undefined) {
      items = items.filter(item => item.available === filters.available);
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        items.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        break;
      case "price_desc":
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "date_desc":
        items.sort((a, b) => new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime());
        break;
      case "date_asc":
        items.sort((a, b) => new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime());
        break;
      case "relevance":
      default:
        // Keep original order for relevance
        break;
    }

    return items;
  }, [filters]);

  const stats = useMemo(() => {
    const totalItems = mockItems.length;
    const availableItems = mockItems.filter(item => item.available).length;
    const avgPrice = mockItems.filter(item => item.price).reduce((sum, item) => sum + item.price!, 0) / mockItems.filter(item => item.price).length;
    const todayItems = mockItems.filter(item => {
      const today = new Date();
      const itemDate = new Date(item.scrapedAt);
      return itemDate.toDateString() === today.toDateString();
    }).length;

    return { totalItems, availableItems, avgPrice: Math.round(avgPrice || 0), todayItems };
  }, []);

  const uniqueSources = Array.from(new Set(mockItems.map(item => item.sourceName)));

  const exportResults = () => {
    const csvData = filteredItems.map(item => ({
      Titolo: item.title,
      Prezzo: item.price || '',
      Valuta: item.currency || '',
      Fonte: item.sourceName,
      URL: item.sourceUrl,
      Disponibile: item.available ? 'Sì' : 'No',
      'Data Scraping': new Date(item.scrapedAt).toLocaleString('it-IT')
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraperhub-results-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold text-foreground">Tutti i Risultati</h1>
          <p className="text-muted-foreground mt-1">
            Gestisci e analizza tutti gli elementi scrapati
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button variant="outline" size="sm" onClick={exportResults}>
            <Download className="w-4 h-4 mr-2" />
            Esporta CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Elementi Totali</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Disponibili</p>
              <p className="text-2xl font-bold">{stats.availableItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Euro className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Prezzo Medio</p>
              <p className="text-2xl font-bold">€{stats.avgPrice}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-surface">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Oggi</p>
              <p className="text-2xl font-bold">{stats.todayItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gradient-surface">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cerca per titolo, descrizione, tag..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filters.groups?.[0] || ""} onValueChange={(value) => 
            setFilters(prev => ({ ...prev, groups: value ? [value] : [] }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Tutti i gruppi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutti i gruppi</SelectItem>
              {mockGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.source || ""} onValueChange={(value) => 
            setFilters(prev => ({ ...prev, source: value || undefined }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Tutte le fonti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutte le fonti</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.sortBy || "date_desc"} onValueChange={(value) => 
            setFilters(prev => ({ ...prev, sortBy: value as any }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Più recenti</SelectItem>
              <SelectItem value="date_asc">Meno recenti</SelectItem>
              <SelectItem value="price_asc">Prezzo crescente</SelectItem>
              <SelectItem value="price_desc">Prezzo decrescente</SelectItem>
              <SelectItem value="relevance">Rilevanza</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {(filters.query || (filters.groups && filters.groups.length > 0) || filters.source) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.query && (
              <Badge variant="secondary">
                Ricerca: "{filters.query}"
              </Badge>
            )}
            {filters.groups?.map(groupId => {
              const group = mockGroups.find(g => g.id === groupId);
              return group ? (
                <Badge key={groupId} variant="secondary">
                  Gruppo: {group.name}
                </Badge>
              ) : null;
            })}
            {filters.source && (
              <Badge variant="secondary">
                Fonte: {filters.source}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilters({ sortBy: "date_desc" })}
              className="h-6 px-2 text-xs"
            >
              Pulisci filtri
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {filteredItems.length} di {mockItems.length} risultati
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            Ordinati per: {
              filters.sortBy === 'date_desc' ? 'Data decrescente' :
              filters.sortBy === 'date_asc' ? 'Data crescente' :
              filters.sortBy === 'price_desc' ? 'Prezzo decrescente' :
              filters.sortBy === 'price_asc' ? 'Prezzo crescente' :
              'Rilevanza'
            }
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-surface">
            <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nessun risultato trovato</h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri o aspetta il prossimo scraping automatico.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item}
                onImageClick={(item) => console.log('Opening:', item.sourceUrl)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
