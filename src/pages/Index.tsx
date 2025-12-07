import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, animate } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  Star,
  Building,
  ChevronRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { StatCard } from '@/components/cards/StatCard';
import { localities } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Brain,
    title: 'AI Valuation Engine',
    description: 'Advanced ML models trained on 50K+ properties for accurate price predictions within 95% accuracy.',
  },
  {
    icon: MapPin,
    title: 'Infrastructure Scoring',
    description: '11 infra metrics analyzed from satellite imagery: power, water, internet, greenery, and more.',
  },
  {
    icon: TrendingUp,
    title: 'Future Projections',
    description: 'Get 1-year and 5-year price forecasts based on historical trends and growth patterns.',
  },
  {
    icon: Shield,
    title: 'Satellite Intelligence',
    description: 'ResNet18 CNN analyzes satellite and street view images for visual property assessment.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Real-time valuation in under 2 seconds. No forms, no waiting, just accurate prices.',
  },
  {
    icon: Sparkles,
    title: 'Smart Comparison',
    description: 'Compare up to 4 properties side-by-side with spider charts and detailed breakdowns.',
  },
];

const stats = [
  { value: 95, suffix: '%', label: 'Accuracy Rate' },
  { value: 10, suffix: 'K+', label: 'Valuations Done' },
  { value: 15, suffix: '+', label: 'Localities Covered' },
  { value: 2, suffix: 's', label: 'Avg Response Time' },
];

const PriceCounter = () => {
  const [price, setPrice] = useState(0);
  
  useEffect(() => {
    const target = 245;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setPrice(Math.round(target * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timer = setTimeout(animate, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
      className="inline-flex items-baseline gap-1"
    >
      <span className="text-6xl md:text-8xl font-display font-bold gradient-text">₹{price}</span>
      <span className="text-2xl md:text-4xl font-display font-bold text-muted-foreground">Lakhs</span>
    </motion.div>
  );
};

const HeatmapCard = ({ locality, index }: { locality: typeof localities[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const heatLevel = locality.avgPrice > 14000 ? 'hot' : locality.avgPrice > 10000 ? 'warm' : 'cool';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative p-4 rounded-xl cursor-pointer transition-all duration-300',
        heatLevel === 'hot' && 'heatmap-hot',
        heatLevel === 'warm' && 'heatmap-warm',
        heatLevel === 'cool' && 'heatmap-cool',
        isHovered && 'scale-105 shadow-float z-10'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-primary-foreground">{locality.name}</span>
        <span className="text-sm font-bold text-primary-foreground">
          ₹{(locality.avgPrice / 1000).toFixed(1)}K/sqft
        </span>
      </div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full bg-card border border-primary/20 rounded-lg p-3 shadow-float z-20 w-48"
        >
          <p className="text-xs text-muted-foreground">Annual Growth</p>
          <p className="text-lg font-bold text-secondary">+{locality.growth}%</p>
        </motion.div>
      )}
    </motion.div>
  );
};

const Index = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        <motion.div style={{ y, opacity }} className="container mx-auto px-4 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Property Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Know Your Property's
            <br />
            <span className="gradient-text">True Value</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Get instant, AI-powered property valuations for Bangalore backed by satellite imagery, 
            infrastructure analysis, and ML algorithms.
          </motion.p>

          {/* Animated Price Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <PriceCounter />
            <p className="text-muted-foreground mt-2">Sample AI Valuation</p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/estimator" className="flex items-center gap-2">
                Get Instant Valuation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/insights">View Market Insights</Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-16"
          >
            {[
              { icon: Shield, text: '95% Accurate' },
              { icon: Building, text: '10K+ Valuations' },
              { icon: Brain, text: 'Satellite AI Powered' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 backdrop-blur-sm">
                <badge.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold mb-2 block">Why VisionPrice</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              AI That Sees <span className="gradient-text">Everything</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge AI analyzes satellite imagery, infrastructure data, and market trends 
              to deliver the most accurate property valuations in Bangalore.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} variant="glass" />
            ))}
          </div>
        </div>
      </section>

      {/* Heatmap Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold mb-2 block">Live Market Data</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Bangalore <span className="gradient-text">Price Heatmap</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hover over localities to see real-time prices and growth rates
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {localities.map((locality, i) => (
              <HeatmapCard key={locality.name} locality={locality} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded heatmap-hot" />
              <span className="text-sm text-muted-foreground">Premium (₹14K+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded heatmap-warm" />
              <span className="text-sm text-muted-foreground">Mid-Range (₹10K-14K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded heatmap-cool" />
              <span className="text-sm text-muted-foreground">Affordable (&lt;₹10K)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center neu-card"
          >
            <div className="absolute inset-0 bg-gradient-radial opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Ready to Know Your
                <br />
                <span className="gradient-text">Property's Worth?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join 10,000+ property owners who trust VisionPrice for accurate, 
                AI-powered valuations.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/estimator" className="flex items-center gap-2">
                  Get Free Valuation
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
