import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemCard } from "@/components/results/ItemCard";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { mockItems, mockGroups } from "@/data/mockData";
import { SearchFilters, ScrapedItem } from "@/types";

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    groups: [],
    sortBy: "relevance"
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter and sort items based on current filters
  const filteredItems = useMemo(() => {
    let items = [...mockItems];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Group filter
    if (filters.groups && filters.groups.length > 0) {
      items = items.filter(item => 
        item.groupIds.some(groupId => filters.groups!.includes(groupId))
      );
    }

    // Price range
    if (filters.priceMin !== undefined) {
      items = items.filter(item => item.price && item.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      items = items.filter(item => item.price && item.price <= filters.priceMax!);
    }

    // Availability
    if (filters.available !== undefined) {
      items = items.filter(item => item.available === filters.available);
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
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
      default:
        // relevance - keep original order
        break;
    }

    return items;
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleGroup = (groupId: string) => {
    const currentGroups = filters.groups || [];
    const newGroups = currentGroups.includes(groupId)
      ? currentGroups.filter(id => id !== groupId)
      : [...currentGroups, groupId];
    updateFilters({ groups: newGroups });
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      groups: [],
      sortBy: "relevance"
    });
  };

  const hasActiveFilters = filters.query || (filters.groups && filters.groups.length > 0) || 
                          filters.priceMin !== undefined || filters.priceMax !== undefined ||
                          filters.available !== undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ricerca Unificata</h1>
        <p className="text-muted-foreground mt-1">
          Cerca tra tutti gli elementi scrapati da {mockItems.length} risultati disponibili
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-gradient-surface border-card-border">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cerca prodotti, prezzi, descrizioni..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordina per" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Rilevanza</SelectItem>
              <SelectItem value="date_desc">Più recenti</SelectItem>
              <SelectItem value="date_asc">Meno recenti</SelectItem>
              <SelectItem value="price_asc">Prezzo crescente</SelectItem>
              <SelectItem value="price_desc">Prezzo decrescente</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtri
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Groups Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Gruppi</label>
                <div className="space-y-2">
                  {mockGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.id}
                        checked={filters.groups?.includes(group.id) || false}
                        onCheckedChange={() => toggleGroup(group.id)}
                      />
                      <label htmlFor={group.id} className="text-sm text-foreground cursor-pointer">
                        {group.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Range Prezzo (€)</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ""}
                    onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ""}
                    onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Disponibilità</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={filters.available === true}
                      onCheckedChange={(checked) => updateFilters({ available: checked ? true : undefined })}
                    />
                    <label htmlFor="available" className="text-sm text-foreground cursor-pointer">
                      Solo disponibili
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.query && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{filters.query}"
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ query: "" })}
                />
              </Badge>
            )}
            
            {filters.groups?.map(groupId => {
              const group = mockGroups.find(g => g.id === groupId);
              return group ? (
                <Badge key={groupId} variant="secondary" className="flex items-center gap-1">
                  {group.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleGroup(groupId)}
                  />
                </Badge>
              ) : null;
            })}

            {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                €{filters.priceMin || 0} - €{filters.priceMax || "∞"}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ priceMin: undefined, priceMax: undefined })}
                />
              </Badge>
            )}

            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
              Pulisci tutti
            </Button>
          </div>
        )}
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {filteredItems.length} risultati trovati
          </h3>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-surface border-card-border">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nessun risultato trovato</h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri di ricerca o i termini utilizzati.
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
