import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  X, 
  Plus, 
  Share2, 
  Download,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SpiderChart } from '@/components/charts/SpiderChart';
import { InfraScoreRing } from '@/components/charts/InfraScoreRing';
import { PropertyEstimate, usePropertyStore } from '@/store/propertyStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ComparisonCard = ({
  property,
  isWinner,
  onRemove,
}: {
  property: PropertyEstimate;
  isWinner: boolean;
  onRemove: () => void;
}) => {
  const avgScore =
    (property.infra_scores.power +
      property.infra_scores.internet +
      property.infra_scores.water +
      property.infra_scores.greenery +
      property.infra_scores.road) / 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'relative glass-card rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing',
        isWinner && 'ring-2 ring-secondary shadow-glow-teal'
      )}
    >
      {isWinner && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
          <Trophy className="w-3 h-3" />
          Best Value
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="h-40 overflow-hidden">
        <img
          src={property.images.street_url}
          alt={property.locality}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="font-display font-bold text-xl mb-1">{property.locality}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {property.bhk} BHK • {property.area_sqft} sqft • {property.property_type}
        </p>

        <div className="mb-6">
          <p className="text-4xl font-display font-bold gradient-text">
            ₹{property.predicted_price_lakhs}L
          </p>
          <p className="text-sm text-muted-foreground">
            ₹{property.price_per_sqft.toLocaleString()}/sqft
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">1 Year</p>
            <p className="font-bold text-primary">₹{property.future_prices.after_1_year_lakhs}L</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">5 Years</p>
            <p className="font-bold text-secondary">₹{property.future_prices.after_5_years_lakhs}L</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Growth</p>
            <p className="font-bold text-secondary">+{property.future_prices.growth_rate}%</p>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <InfraScoreRing score={avgScore} label="Avg Score" size={60} strokeWidth={4} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Power', value: property.infra_scores.power },
            { label: 'Internet', value: property.infra_scores.internet },
            { label: 'Water', value: property.infra_scores.water },
            { label: 'Greenery', value: property.infra_scores.greenery },
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-muted-foreground">{item.label}</span>
              <span
                className={cn(
                  'font-semibold',
                  item.value >= 8 ? 'text-secondary' : item.value >= 6 ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Comparison = () => {
  const { comparisonList, removeFromComparison, clearComparison } = usePropertyStore();
  const { toast } = useToast();

  // Determine winner (highest value per sqft considering growth)
  const getWinnerId = () => {
    if (comparisonList.length < 2) return null;
    let winner = comparisonList[0];
    let bestScore = 0;

    comparisonList.forEach((prop) => {
      const score =
        (prop.future_prices.growth_rate * 10) +
        ((prop.infra_scores.power + prop.infra_scores.internet + prop.infra_scores.water) / 3);
      if (score > bestScore) {
        bestScore = score;
        winner = prop;
      }
    });

    return winner.id;
  };

  const winnerId = getWinnerId();

  const handleShare = () => {
    const url = `${window.location.origin}/comparison`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'Share this link to show your comparison.',
    });
  };

  return (
    <Layout>
      <section className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4" />
              Property Comparison
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Compare <span className="gradient-text">Properties</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Side-by-side comparison of your saved properties with detailed infrastructure analysis
            </p>
          </motion.div>

          {comparisonList.length > 0 ? (
            <>
              {/* Actions */}
              <div className="flex justify-center gap-4 mb-8">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => clearComparison()}>
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
                <Button variant="premium" asChild>
                  <Link to="/estimator">
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Link>
                </Button>
              </div>

              {/* Comparison Cards */}
              <Reorder.Group
                axis="x"
                values={comparisonList}
                onReorder={() => {}}
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                {comparisonList.map((property) => (
                  <Reorder.Item key={property.id} value={property}>
                    <ComparisonCard
                      property={property}
                      isWinner={property.id === winnerId}
                      onRemove={() => removeFromComparison(property.id)}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {/* Spider Chart */}
              {comparisonList.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-8 rounded-2xl"
                >
                  <h2 className="font-display font-bold text-2xl mb-8 text-center">
                    Infrastructure Score Comparison
                  </h2>
                  <div className="flex justify-center">
                    <SpiderChart properties={comparisonList} size={350} />
                  </div>
                </motion.div>
              )}

              {/* Price Difference */}
              {comparisonList.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 glass-card p-8 rounded-2xl"
                >
                  <h2 className="font-display font-bold text-2xl mb-6 text-center">
                    Price Analysis
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/10">
                          <th className="text-left py-3 px-4 font-semibold">Property</th>
                          <th className="text-right py-3 px-4 font-semibold">Price</th>
                          <th className="text-right py-3 px-4 font-semibold">₹/sqft</th>
                          <th className="text-right py-3 px-4 font-semibold">Growth</th>
                          <th className="text-right py-3 px-4 font-semibold">5Y Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonList.map((prop, i) => {
                          const pricePerSqftDiff = i > 0 
                            ? ((prop.price_per_sqft - comparisonList[0].price_per_sqft) / comparisonList[0].price_per_sqft) * 100
                            : 0;
                          return (
                            <tr key={prop.id} className="border-b border-primary/5">
                              <td className="py-4 px-4 font-medium">{prop.locality}</td>
                              <td className="py-4 px-4 text-right font-bold gradient-text">₹{prop.predicted_price_lakhs}L</td>
                              <td className="py-4 px-4 text-right">
                                ₹{prop.price_per_sqft.toLocaleString()}
                                {i > 0 && (
                                  <span className={cn(
                                    'ml-2 text-xs font-semibold',
                                    pricePerSqftDiff > 0 ? 'text-destructive' : 'text-secondary'
                                  )}>
                                    {pricePerSqftDiff > 0 ? '+' : ''}{pricePerSqftDiff.toFixed(1)}%
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-right text-secondary font-semibold">+{prop.future_prices.growth_rate}%</td>
                              <td className="py-4 px-4 text-right font-bold">₹{prop.future_prices.after_5_years_lakhs}L</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="neu-card p-16 rounded-2xl text-center max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4">No Properties to Compare</h2>
              <p className="text-muted-foreground mb-8">
                Add properties from the Estimator or Portfolio to start comparing
              </p>
              <Button variant="hero" asChild>
                <Link to="/estimator" className="inline-flex items-center gap-2">
                  Go to Estimator
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Comparison;
