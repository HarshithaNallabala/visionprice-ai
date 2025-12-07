import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Filter, Flame, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { localities } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

const Insights = () => {
  const [timeRange, setTimeRange] = useState<'1Y' | '5Y'>('1Y');
  const [sortBy, setSortBy] = useState<'price' | 'growth'>('price');

  const sortedLocalities = [...localities].sort((a, b) => {
    if (sortBy === 'price') return b.avgPrice - a.avgPrice;
    return b.growth - a.growth;
  });

  const topGrowth = [...localities].sort((a, b) => b.growth - a.growth).slice(0, 3);
  const topPremium = [...localities].sort((a, b) => b.avgPrice - a.avgPrice).slice(0, 3);

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
              <TrendingUp className="w-4 h-4" />
              Market Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Bangalore <span className="gradient-text">Real Estate Data</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Live market trends, price heatmaps, and growth projections for all major localities
            </p>
          </motion.div>

          {/* Hot/Cold Zones */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Hottest Zones</h3>
                  <p className="text-sm text-muted-foreground">Highest growth potential</p>
                </div>
              </div>
              <div className="space-y-4">
                {topGrowth.map((loc, i) => (
                  <motion.div
                    key={loc.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-sm font-bold text-destructive">
                        {i + 1}
                      </span>
                      <span className="font-semibold">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-destructive font-bold">
                      <ArrowUpRight className="w-4 h-4" />
                      +{loc.growth}%/yr
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/20 flex items-center justify-center">
                  <Snowflake className="w-5 h-5 text-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Premium Zones</h3>
                  <p className="text-sm text-muted-foreground">Highest property values</p>
                </div>
              </div>
              <div className="space-y-4">
                {topPremium.map((loc, i) => (
                  <motion.div
                    key={loc.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-cyan/5 border border-cyan/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-sm font-bold text-cyan">
                        {i + 1}
                      </span>
                      <span className="font-semibold">{loc.name}</span>
                    </div>
                    <div className="text-cyan font-bold">
                      ₹{(loc.avgPrice / 1000).toFixed(1)}K/sqft
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
            </div>
            <Button
              variant={sortBy === 'price' ? 'premium' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Price (High to Low)
            </Button>
            <Button
              variant={sortBy === 'growth' ? 'premium' : 'outline'}
              size="sm"
              onClick={() => setSortBy('growth')}
            >
              Growth Rate
            </Button>
            <div className="ml-auto flex gap-2">
              <Button
                variant={timeRange === '1Y' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange('1Y')}
              >
                1 Year
              </Button>
              <Button
                variant={timeRange === '5Y' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange('5Y')}
              >
                5 Years
              </Button>
            </div>
          </motion.div>

          {/* Price Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left py-4 px-6 font-display font-semibold">Locality</th>
                    <th className="text-right py-4 px-6 font-display font-semibold">Avg Price/sqft</th>
                    <th className="text-right py-4 px-6 font-display font-semibold">Annual Growth</th>
                    <th className="text-right py-4 px-6 font-display font-semibold">
                      {timeRange === '1Y' ? '1Y Projection' : '5Y Projection'}
                    </th>
                    <th className="text-center py-4 px-6 font-display font-semibold">Heat</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLocalities.map((loc, i) => {
                    const projectedPrice = timeRange === '1Y'
                      ? loc.avgPrice * (1 + loc.growth / 100)
                      : loc.avgPrice * Math.pow(1 + loc.growth / 100, 5);
                    const heatLevel = loc.growth > 12 ? 'hot' : loc.growth > 8 ? 'warm' : 'cool';
                    
                    return (
                      <motion.tr
                        key={loc.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        className="border-b border-primary/5 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {i + 1}
                            </span>
                            <span className="font-semibold">{loc.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-bold">
                          ₹{loc.avgPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={cn(
                            'inline-flex items-center gap-1 font-semibold',
                            loc.growth > 10 ? 'text-secondary' : loc.growth > 7 ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            <ArrowUpRight className="w-4 h-4" />
                            {loc.growth}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold gradient-text">
                          ₹{Math.round(projectedPrice).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              heatLevel === 'hot' && 'bg-destructive/20',
                              heatLevel === 'warm' && 'bg-gold/20',
                              heatLevel === 'cool' && 'bg-cyan/20'
                            )}>
                              {heatLevel === 'hot' && <Flame className="w-4 h-4 text-destructive" />}
                              {heatLevel === 'warm' && <Flame className="w-4 h-4 text-gold" />}
                              {heatLevel === 'cool' && <Snowflake className="w-4 h-4 text-cyan" />}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { label: 'Avg Price/sqft', value: `₹${Math.round(localities.reduce((a, b) => a + b.avgPrice, 0) / localities.length / 1000)}K` },
              { label: 'Avg Growth', value: `${(localities.reduce((a, b) => a + b.growth, 0) / localities.length).toFixed(1)}%` },
              { label: 'Highest Price', value: `₹${Math.max(...localities.map(l => l.avgPrice)) / 1000}K` },
              { label: 'Highest Growth', value: `${Math.max(...localities.map(l => l.growth))}%` },
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

export default Insights;
