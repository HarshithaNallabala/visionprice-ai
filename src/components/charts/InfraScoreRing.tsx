import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfraScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export const InfraScoreRing = ({
  score,
  label,
  size = 80,
  strokeWidth = 6,
}: InfraScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  const getColor = (score: number) => {
    if (score >= 8) return 'hsl(var(--secondary))';
    if (score >= 6) return 'hsl(var(--primary))';
    if (score >= 4) return 'hsl(var(--gold))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-lg">{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
};
