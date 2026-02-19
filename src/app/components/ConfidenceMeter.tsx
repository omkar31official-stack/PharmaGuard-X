import { motion } from 'motion/react';

interface ConfidenceMeterProps {
  score: number; // 0-1
  size?: 'small' | 'medium' | 'large';
}

export function ConfidenceMeter({ score, size = 'medium' }: ConfidenceMeterProps) {
  const sizeMap = {
    small: { diameter: 80, strokeWidth: 6, fontSize: 'text-lg' },
    medium: { diameter: 120, strokeWidth: 8, fontSize: 'text-2xl' },
    large: { diameter: 160, strokeWidth: 10, fontSize: 'text-3xl' }
  };
  
  const config = sizeMap[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.round(score * 100);
  const offset = circumference - (score * circumference);
  
  // Determine color based on confidence
  const getColor = () => {
    if (score >= 0.8) return '#10b981'; // green
    if (score >= 0.6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          className="transform -rotate-90"
          width={config.diameter}
          height={config.diameter}
        >
          {/* Background circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference
            }}
          />
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${config.fontSize} font-bold text-gray-900`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-xs text-gray-600">Confidence</span>
        </div>
      </div>
    </div>
  );
}
