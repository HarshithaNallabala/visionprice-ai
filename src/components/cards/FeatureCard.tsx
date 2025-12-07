import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  variant?: 'default' | 'glass' | 'gradient';
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
  variant = 'default',
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="card-3d perspective-1000"
    >
      <div
        className={cn(
          'card-3d-inner p-8 rounded-2xl h-full transition-all duration-500',
          variant === 'default' && 'neu-card hover:shadow-glow',
          variant === 'glass' && 'glass-card hover:border-primary/40',
          variant === 'gradient' && 'gradient-border hover:shadow-float'
        )}
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-premium flex items-center justify-center mb-6 shadow-glow">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
        <h3 className="font-display font-bold text-xl mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
