import { motion } from 'framer-motion';
import { PropertyEstimate } from '@/store/propertyStore';

interface SpiderChartProps {
  properties: PropertyEstimate[];
  size?: number;
}

const metrics = [
  { key: 'power', label: 'Power' },
  { key: 'internet', label: 'Internet' },
  { key: 'water', label: 'Water' },
  { key: 'greenery', label: 'Greenery' },
  { key: 'road', label: 'Road' },
  { key: 'schools', label: 'Schools' },
];

const colors = [
  'hsl(217, 91%, 60%)', // Sapphire
  'hsl(174, 84%, 45%)', // Teal
  'hsl(45, 93%, 58%)', // Gold
  'hsl(280, 87%, 60%)', // Purple
];

export const SpiderChart = ({ properties, size = 300 }: SpiderChartProps) => {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getPolygonPoints = (property: PropertyEstimate) => {
    return metrics
      .map((metric, i) => {
        const value = property.infra_scores[metric.key as keyof typeof property.infra_scores];
        const point = getPoint(i, typeof value === 'number' ? value : 5);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grid */}
        {Array.from({ length: levels }).map((_, i) => {
          const levelRadius = (radius * (i + 1)) / levels;
          const points = metrics
            .map((_, j) => {
              const angle = (Math.PI * 2 * j) / metrics.length - Math.PI / 2;
              return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
            })
            .join(' ');
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {metrics.map((_, i) => {
          const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="hsl(var(--muted))"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Data polygons */}
        {properties.map((property, propIndex) => (
          <motion.polygon
            key={property.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: propIndex * 0.2 }}
            points={getPolygonPoints(property)}
            fill={colors[propIndex % colors.length]}
            fillOpacity={0.2}
            stroke={colors[propIndex % colors.length]}
            strokeWidth="2"
            style={{ transformOrigin: 'center' }}
          />
        ))}

        {/* Labels */}
        {metrics.map((metric, i) => {
          const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={metric.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground font-medium"
            >
              {metric.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {properties.slice(0, 4).map((property, i) => (
          <div key={property.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="text-xs text-muted-foreground">{property.locality}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
