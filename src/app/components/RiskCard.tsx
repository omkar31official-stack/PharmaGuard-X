import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { RiskLabel, Severity } from '../types/pharma';

interface RiskCardProps {
  drug: string;
  risk: RiskLabel;
  severity: Severity;
  confidence: number;
  onClick?: () => void;
}

export function RiskCard({ drug, risk, severity, confidence, onClick }: RiskCardProps) {
  const riskConfig = {
    'Safe': {
      color: 'green',
      bgClass: 'bg-green-50 border-green-200',
      textClass: 'text-green-900',
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      badge: 'bg-green-100 text-green-800'
    },
    'Adjust Dosage': {
      color: 'yellow',
      bgClass: 'bg-yellow-50 border-yellow-200',
      textClass: 'text-yellow-900',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'Toxic': {
      color: 'red',
      bgClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-900',
      icon: XCircle,
      iconColor: 'text-red-600',
      badge: 'bg-red-100 text-red-800'
    },
    'Ineffective': {
      color: 'red',
      bgClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      badge: 'bg-red-100 text-red-800'
    },
    'Unknown': {
      color: 'gray',
      bgClass: 'bg-gray-50 border-gray-200',
      textClass: 'text-gray-900',
      icon: HelpCircle,
      iconColor: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-800'
    }
  };
  
  const config = riskConfig[risk];
  const Icon = config.icon;
  
  const shouldPulse = severity === 'critical' || severity === 'high';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`
          p-6 cursor-pointer transition-all hover:shadow-lg
          ${config.bgClass}
          ${onClick ? 'hover:scale-[1.02]' : ''}
        `}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{drug}</h3>
            <div className="flex items-center gap-2">
              <Badge className={config.badge}>
                {risk}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {(confidence * 100).toFixed(0)}% confidence
              </Badge>
            </div>
          </div>
          
          <motion.div
            animate={shouldPulse ? {
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`w-12 h-12 rounded-full bg-white/50 flex items-center justify-center`}>
              <Icon className={`w-7 h-7 ${config.iconColor}`} />
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <span className="text-xs text-gray-600">Severity</span>
            <p className={`text-sm font-semibold ${config.textClass} capitalize`}>
              {severity}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-600">Confidence Score</span>
            <p className={`text-sm font-semibold ${config.textClass}`}>
              {confidence.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
