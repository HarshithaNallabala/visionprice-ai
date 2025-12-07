import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Filter, Plus, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { portfolioProperties } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

const categories = ['All', 'Luxury', 'Mid-Range', 'Budget', 'Investment'];

const getCategory = (price: number, growth: number) => {
  if (price > 200) return 'Luxury';
  if (growth > 12) return 'Investment';
  if (price > 100) return 'Mid-Range';
  return 'Budget';
};

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProperties = portfolioProperties.filter((prop) => {
    if (activeFilter === 'All') return true;
    const category = getCategory(prop.predicted_price_lakhs, prop.future_prices.growth_rate);
    return category === activeFilter;
  });

  const visibleProperties = filteredProperties.slice(0, visibleCount);

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
              <Briefcase className="w-4 h-4" />
              Sample Valuations
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Property <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse through our curated collection of AI-valued properties across Bangalore
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? 'premium' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveFilter(category);
                  setVisibleCount(6);
                }}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visibleProperties.map((property, i) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="relative">
                    <div className={cn(
                      'absolute -top-3 -right-3 z-10 px-3 py-1 rounded-full text-xs font-bold',
                      getCategory(property.predicted_price_lakhs, property.future_prices.growth_rate) === 'Luxury' && 'bg-gold text-gold-foreground',
                      getCategory(property.predicted_price_lakhs, property.future_prices.growth_rate) === 'Investment' && 'bg-secondary text-secondary-foreground',
                      getCategory(property.predicted_price_lakhs, property.future_prices.growth_rate) === 'Mid-Range' && 'bg-primary text-primary-foreground',
                      getCategory(property.predicted_price_lakhs, property.future_prices.growth_rate) === 'Budget' && 'bg-muted text-muted-foreground',
                    )}>
                      {getCategory(property.predicted_price_lakhs, property.future_prices.growth_rate)}
                    </div>
                    <PropertyCard property={property} index={i} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {visibleCount < filteredProperties.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <Button
                variant="premium"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                Load More Properties
              </Button>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: 'Total Properties', value: portfolioProperties.length },
              { label: 'Total Value', value: `₹${Math.round(portfolioProperties.reduce((a, b) => a + b.predicted_price_lakhs, 0))}L` },
              { label: 'Avg Price', value: `₹${Math.round(portfolioProperties.reduce((a, b) => a + b.predicted_price_lakhs, 0) / portfolioProperties.length)}L` },
              { label: 'Localities', value: new Set(portfolioProperties.map(p => p.locality)).size },
            ].map((stat, i) => (
              <div key={i} className="neu-card p-6 rounded-2xl text-center">
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
