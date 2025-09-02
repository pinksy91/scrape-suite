import { ScrapedItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Calendar, MapPin } from "lucide-react";

interface ItemCardProps {
  item: ScrapedItem;
  onImageClick?: (item: ScrapedItem) => void;
}

export function ItemCard({ item, onImageClick }: ItemCardProps) {
  const handleImageClick = () => {
    // Open source URL in new tab
    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
    onImageClick?.(item);
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return null;
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(price);
  };

  const timeAgo = new Date(item.scrapedAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="group overflow-hidden bg-gradient-surface border-card-border hover:shadow-tech transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      {item.imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={handleImageClick}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Apri fonte
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight flex-1">
            {item.title}
          </h3>
          {item.price && (
            <div className="flex-shrink-0">
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground font-bold">
                {formatPrice(item.price, item.currency)}
              </Badge>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{item.sourceName}</span>
            <span>•</span>
            <Calendar className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>

          <div className="flex items-center gap-2">
            {!item.available && (
              <Badge variant="destructive" className="text-xs">
                Non disponibile
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleImageClick}
              className="h-8 px-2 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Vedi
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}