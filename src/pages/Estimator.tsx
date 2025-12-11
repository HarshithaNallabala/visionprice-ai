import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  MapPin,
  Square,
  Bed,
  Bath,
  Calendar,
  Building2,
  Sparkles,
  TrendingUp,
  Plus,
  Check,
  Zap,
  Info,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfraScoreRing } from '@/components/charts/InfraScoreRing';
import { localities, propertyTypes, estimateProperty } from '@/lib/mockApi';
import { PropertyEstimate, usePropertyStore } from '@/store/propertyStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Estimator = () => {
  const [formData, setFormData] = useState({
    locality: '',
    area_sqft: 1500,
    bhk: 2,
    bath: 2,
    age_years: 5,
    property_type: 'Apartment',
  });
  const [result, setResult] = useState<PropertyEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState<'satellite' | 'street'>('satellite');
  
  const { addProperty, addToComparison, isInComparison } = usePropertyStore();
  const { toast } = useToast();

  const handleEstimate = useCallback(async () => {
    if (!formData.locality) {
      toast({
        title: 'Select a locality',
        description: 'Please choose a locality to get an estimate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const estimate = await estimateProperty(formData);
      setResult(estimate);
      addProperty(estimate);
      toast({
        title: 'Valuation Complete!',
        description: `Estimated price: ₹${estimate.predicted_price_lakhs} Lakhs`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get estimate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, addProperty, toast]);

  // Debounced auto-estimate on form change
  useEffect(() => {
    if (formData.locality) {
      const timer = setTimeout(() => {
        handleEstimate();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formData.locality, formData.area_sqft, formData.bhk, formData.bath, formData.age_years, formData.property_type]);

  const infraMetrics = result ? [
    { label: 'Power', value: result.infra_scores.power },
    { label: 'Internet', value: result.infra_scores.internet },
    { label: 'Water', value: result.infra_scores.water },
    { label: 'Greenery', value: result.infra_scores.greenery },
    { label: 'Road', value: result.infra_scores.road },
    { label: 'Schools', value: result.infra_scores.schools },
    { label: 'Hospitals', value: result.infra_scores.hospitals },
    { label: 'Parks', value: result.infra_scores.parks },
    { label: 'Low Pollution', value: result.infra_scores.pollution },
    { label: 'Low Noise', value: result.infra_scores.noise },
    { label: 'Density', value: 10 - (result.infra_scores.building_density / 10) }, // Lower density = better
    { label: 'Similarity', value: result.infra_scores.similarity_score * 10 }, // Scale to 0-10
  ] : [];

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
              <Calculator className="w-4 h-4" />
              AI Property Estimator
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Get Your <span className="gradient-text">Instant Valuation</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your property details and watch our AI calculate its value in real-time
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form Panel */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Property Details
              </h2>

              <div className="space-y-6">
                {/* Locality Select */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Locality
                  </label>
                  <Select
                    value={formData.locality}
                    onValueChange={(value) => setFormData({ ...formData, locality: value })}
                  >
                    <SelectTrigger className="input-neu h-12">
                      <SelectValue placeholder="Select locality" />
                    </SelectTrigger>
                    <SelectContent>
                      {localities.map((loc) => (
                        <SelectItem key={loc.name} value={loc.name}>
                          {loc.name} - ₹{(loc.avgPrice / 1000).toFixed(1)}K/sqft avg
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-primary" />
                      Area (sq.ft)
                    </span>
                    <span className="text-primary font-bold">{formData.area_sqft.toLocaleString()}</span>
                  </label>
                  <Slider
                    value={[formData.area_sqft]}
                    onValueChange={([value]) => setFormData({ ...formData, area_sqft: value })}
                    min={500}
                    max={5000}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>500 sqft</span>
                    <span>5,000 sqft</span>
                  </div>
                </div>

                {/* BHK and Bath */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Bed className="w-4 h-4 text-primary" />
                      BHK
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((bhk) => (
                        <button
                          key={bhk}
                          onClick={() => setFormData({ ...formData, bhk })}
                          className={cn(
                            'flex-1 py-2 rounded-lg font-semibold transition-all duration-300',
                            formData.bhk === bhk
                              ? 'bg-gradient-premium text-primary-foreground shadow-glow'
                              : 'neu-card hover:text-primary'
                          )}
                        >
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Bath className="w-4 h-4 text-primary" />
                      Bathrooms
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((bath) => (
                        <button
                          key={bath}
                          onClick={() => setFormData({ ...formData, bath })}
                          className={cn(
                            'flex-1 py-2 rounded-lg font-semibold transition-all duration-300',
                            formData.bath === bath
                              ? 'bg-gradient-premium text-primary-foreground shadow-glow'
                              : 'neu-card hover:text-primary'
                          )}
                        >
                          {bath}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Age Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Property Age (years)
                    </span>
                    <span className="text-primary font-bold">{formData.age_years}</span>
                  </label>
                  <Slider
                    value={[formData.age_years]}
                    onValueChange={([value]) => setFormData({ ...formData, age_years: value })}
                    min={0}
                    max={30}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>New</span>
                    <span>30 years</span>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, property_type: type })}
                        className={cn(
                          'py-3 px-4 rounded-xl font-medium transition-all duration-300 text-sm',
                          formData.property_type === type
                            ? 'bg-gradient-premium text-primary-foreground shadow-glow'
                            : 'neu-card hover:text-primary'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleEstimate}
                  disabled={isLoading || !formData.locality}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Get Valuation
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Price Card */}
                    <div className="neu-card p-8 rounded-2xl text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
                      <div className="relative z-10">
                        <p className="text-muted-foreground mb-2">Estimated Property Value</p>
                        <motion.div
                          key={result.predicted_price_lakhs}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                        >
                          <span className="text-6xl md:text-7xl font-display font-bold gradient-text">
                            ₹{result.predicted_price_lakhs}L
                          </span>
                        </motion.div>
                        <p className="text-xl text-muted-foreground mt-2">
                          ₹{result.price_per_sqft.toLocaleString()}/sqft
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                          <Button
                            variant={isInComparison(result.id) ? 'secondary' : 'premium'}
                            onClick={() => addToComparison(result)}
                            disabled={isInComparison(result.id)}
                          >
                            {isInComparison(result.id) ? (
                              <>
                                <Check className="w-4 h-4" />
                                Added to Compare
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Add to Compare
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card p-5 rounded-xl flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">AI Insight</h4>
                        <p className="text-sm text-muted-foreground">
                          This area's {((result.infra_scores.power + result.infra_scores.internet + result.infra_scores.water + result.infra_scores.greenery + result.infra_scores.road) / 5).toFixed(1)} average infra score 
                          adds approximately ₹{Math.round((result.predicted_price_lakhs * 0.08))}L to the property value compared to lower-rated areas.
                        </p>
                      </div>
                    </div>

                    {/* Future Projections */}
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        Future Projections
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-xl bg-muted/30">
                          <p className="text-xs text-muted-foreground mb-1">Current</p>
                          <p className="text-xl font-bold">₹{result.predicted_price_lakhs}L</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-primary/10">
                          <p className="text-xs text-muted-foreground mb-1">1 Year</p>
                          <p className="text-xl font-bold text-primary">₹{result.future_prices.after_1_year_lakhs}L</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-secondary/10">
                          <p className="text-xs text-muted-foreground mb-1">5 Years</p>
                          <p className="text-xl font-bold text-secondary">₹{result.future_prices.after_5_years_lakhs}L</p>
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Annual Growth Rate: <span className="text-secondary font-semibold">+{result.future_prices.growth_rate}%</span>
                      </p>
                    </div>

                    {/* Infra Scores */}
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="font-display font-bold text-lg mb-6">Infrastructure Scores</h3>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {infraMetrics.map((metric) => (
                          <InfraScoreRing
                            key={metric.label}
                            score={metric.value}
                            label={metric.label}
                            size={60}
                            strokeWidth={4}
                          />
                        ))}
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Metro Distance: <span className="font-semibold">{result.infra_scores.metro_distance_km} km</span>
                      </p>
                    </div>

                    {/* Images */}
                    <div className="glass-card p-6 rounded-xl">
                      <h3 className="font-display font-bold text-lg mb-4">Property Imagery</h3>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => setActiveImage('satellite')}
                          className={cn(
                            'flex-1 py-2 rounded-lg font-medium transition-all',
                            activeImage === 'satellite'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          Satellite View
                        </button>
                        <button
                          onClick={() => setActiveImage('street')}
                          className={cn(
                            'flex-1 py-2 rounded-lg font-medium transition-all',
                            activeImage === 'street'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          Street View
                        </button>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            src={activeImage === 'satellite' ? result.images.satellite_url : result.images.street_url}
                            alt={activeImage === 'satellite' ? 'Satellite view' : 'Street view'}
                            className="w-full h-full object-cover"
                          />
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="neu-card p-12 rounded-2xl text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Calculator className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">Ready to Estimate</h3>
                    <p className="text-muted-foreground">
                      Select a locality and adjust the sliders to get an instant AI-powered valuation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Estimator;
