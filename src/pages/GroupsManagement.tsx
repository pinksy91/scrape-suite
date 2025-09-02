import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  FolderTree, 
  Edit, 
  Trash2, 
  Tag,
  BarChart3
} from "lucide-react";
import { mockGroups, mockSites, mockItems } from "@/data/mockData";
import { Group } from "@/types";

const colorOptions = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", 
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
];

export function GroupsManagement() {
  const [groups, setGroups] = useState(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getGroupStats = (groupId: string) => {
    const sitesCount = mockSites.filter(site => site.groups.includes(groupId)).length;
    const itemsCount = mockItems.filter(item => item.groupIds.includes(groupId)).length;
    return { sitesCount, itemsCount };
  };

  const GroupForm = ({ group, onSave, onClose }: { 
    group?: Group; 
    onSave: (group: Partial<Group>) => void; 
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: group?.name || "",
      slug: group?.slug || "",
      description: group?.description || "",
      color: group?.color || colorOptions[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const slugValue = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      onSave({ ...formData, slug: slugValue });
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Gruppo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              name: e.target.value,
              slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
            }))}
            placeholder="Es. Elettronica"
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug URL</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="elettronica"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descrizione del gruppo..."
          />
        </div>

        <div>
          <Label htmlFor="color">Colore</Label>
          <div className="flex gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-foreground' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData(prev => ({ ...prev, color }))}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {group ? "Aggiorna Gruppo" : "Aggiungi Gruppo"}
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
          <h1 className="text-3xl font-bold text-foreground">Gestione Gruppi</h1>
          <p className="text-muted-foreground mt-1">
            Organizza i siti e risultati in gruppi tematici ({groups.length} gruppi)
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Gruppo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Aggiungi Nuovo Gruppo</DialogTitle>
            </DialogHeader>
            <GroupForm 
              onSave={(data) => {
                const newGroup: Group = {
                  ...data,
                  id: String(groups.length + 1)
                } as Group;
                setGroups(prev => [...prev, newGroup]);
              }}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <Card className="p-6 bg-gradient-surface">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Panoramica Gruppi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <p className="text-2xl font-bold text-foreground">{groups.length}</p>
            <p className="text-sm text-muted-foreground">Gruppi Totali</p>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <p className="text-2xl font-bold text-primary">
              {mockSites.reduce((acc, site) => acc + site.groups.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Assegnazioni Siti</p>
          </div>
          <div className="text-center p-4 bg-surface-variant rounded-lg">
            <p className="text-2xl font-bold text-accent">
              {mockItems.reduce((acc, item) => acc + item.groupIds.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Elementi Categorizzati</p>
          </div>
        </div>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const stats = getGroupStats(group.id);
          return (
            <Card key={group.id} className="p-6 bg-gradient-surface border-card-border hover:shadow-medium transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen && selectedGroup?.id === group.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setSelectedGroup(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedGroup(group)}
                        className="w-8 h-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Modifica Gruppo</DialogTitle>
                      </DialogHeader>
                      <GroupForm 
                        group={selectedGroup || undefined}
                        onSave={(data) => {
                          setGroups(prev => prev.map(g => 
                            g.id === selectedGroup?.id ? { ...g, ...data } : g
                          ));
                        }}
                        onClose={() => {
                          setIsEditDialogOpen(false);
                          setSelectedGroup(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setGroups(prev => prev.filter(g => g.id !== group.id))}
                    className="w-8 h-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    /{group.slug}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{stats.sitesCount}</p>
                    <p className="text-xs text-muted-foreground">Siti</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-accent">{stats.itemsCount}</p>
                    <p className="text-xs text-muted-foreground">Elementi</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {groups.length === 0 && (
        <Card className="p-12 text-center bg-gradient-surface">
          <FolderTree className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nessun gruppo configurato</h3>
          <p className="text-muted-foreground mb-4">
            Crea gruppi per organizzare meglio i tuoi siti e risultati.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Crea Primo Gruppo
          </Button>
        </Card>
      )}
    </div>
  );
}