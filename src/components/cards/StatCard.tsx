import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  index: number;
}

export const StatCard = ({ value, suffix = '', prefix = '', label, index }: StatCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      delay: index * 0.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="stat-glow neu-card p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-500"
    >
      <div className="font-display font-bold text-4xl md:text-5xl mb-2 gradient-text">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
};
