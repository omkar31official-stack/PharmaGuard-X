import { motion } from 'motion/react';

interface DNAAnimationProps {
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export function DNAAnimation({ size = 'large', animate = true }: DNAAnimationProps) {
  const sizeMap = {
    small: { width: 80, height: 120 },
    medium: { width: 120, height: 180 },
    large: { width: 200, height: 300 }
  };
  
  const dimensions = sizeMap[size];
  
  return (
    <div className="flex items-center justify-center">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* DNA Double Helix */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const y = i * 30 + 20;
          const offset = Math.sin((i * Math.PI) / 5) * 40;
          
          return (
            <g key={i}>
              {/* Left strand */}
              <motion.circle
                cx={100 + offset}
                cy={y}
                r="8"
                fill="#0066B4"
                initial={{ opacity: 0, scale: 0 }}
                animate={animate ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1, 0.8]
                } : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
              
              {/* Right strand */}
              <motion.circle
                cx={100 - offset}
                cy={y}
                r="8"
                fill="#00A3E0"
                initial={{ opacity: 0, scale: 0 }}
                animate={animate ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1, 0.8]
                } : { opacity: 1, scale: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2 + 0.1
                }}
              />
              
              {/* Connecting line */}
              {i < 9 && (
                <>
                  <motion.line
                    x1={100 + offset}
                    y1={y}
                    x2={100 - offset}
                    y2={y}
                    stroke="#0066B4"
                    strokeWidth="2"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1
                    }}
                  />
                  
                  {/* Curved connection to next base pair */}
                  <motion.path
                    d={`M ${100 + offset} ${y} Q ${100 + offset * 0.5} ${y + 15} ${100 + Math.sin(((i + 1) * Math.PI) / 5) * 40} ${y + 30}`}
                    stroke="#0066B4"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1
                    }}
                  />
                  
                  <motion.path
                    d={`M ${100 - offset} ${y} Q ${100 - offset * 0.5} ${y + 15} ${100 - Math.sin(((i + 1) * Math.PI) / 5) * 40} ${y + 30}`}
                    stroke="#00A3E0"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={animate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1
                    }}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
