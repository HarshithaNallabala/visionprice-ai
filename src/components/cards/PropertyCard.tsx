import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, TrendingUp, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyEstimate, usePropertyStore } from '@/store/propertyStore';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: PropertyEstimate;
  index?: number;
  showCompare?: boolean;
}

export const PropertyCard = ({ property, index = 0, showCompare = true }: PropertyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToComparison, removeFromComparison, isInComparison } = usePropertyStore();
  const inComparison = isInComparison(property.id);

  const avgInfraScore = 
    (property.infra_scores.power +
      property.infra_scores.internet +
      property.infra_scores.water +
      property.infra_scores.greenery +
      property.infra_scores.road) / 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative w-full h-[380px] preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden neu-card">
          <div className="relative h-44 overflow-hidden">
            <img
              src={property.images.street_url}
              alt={property.locality}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-premium text-primary-foreground text-xs font-semibold">
              {property.property_type}
            </div>
            {showCompare && (
              <Button
                variant="glass"
                size="icon"
                className="absolute top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  inComparison
                    ? removeFromComparison(property.id)
                    : addToComparison(property);
                }}
              >
                {inComparison ? (
                  <Check className="w-4 h-4 text-secondary" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-lg line-clamp-1">{property.locality}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Bangalore
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-xl gradient-text">
                  ₹{property.predicted_price_lakhs}L
                </p>
                <p className="text-muted-foreground text-xs">
                  ₹{property.price_per_sqft}/sqft
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {property.bhk} BHK
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {property.bath} Bath
              </span>
              <span className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                {property.area_sqft} sqft
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  +{property.future_prices.growth_rate}%/yr
                </span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                Score: {avgInfraScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden glass-card p-5">
          <h4 className="font-display font-bold text-lg mb-4">Infrastructure Scores</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Power', value: property.infra_scores.power },
              { label: 'Internet', value: property.infra_scores.internet },
              { label: 'Water', value: property.infra_scores.water },
              { label: 'Greenery', value: property.infra_scores.greenery },
              { label: 'Road', value: property.infra_scores.road },
              { label: 'Schools', value: property.infra_scores.schools },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    item.value >= 8 ? 'text-secondary' : item.value >= 6 ? 'text-primary' : 'text-destructive'
                  )}
                >
                  {item.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/10 pt-4">
            <h5 className="font-semibold text-sm mb-2">Future Value</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">1 Year</span>
                <span className="font-semibold">₹{property.future_prices.after_1_year_lakhs}L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">5 Years</span>
                <span className="font-semibold text-secondary">₹{property.future_prices.after_5_years_lakhs}L</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
