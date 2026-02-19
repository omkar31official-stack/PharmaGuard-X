import { Card } from './ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types/pharma';

interface GeneImpactRadarProps {
  results: AnalysisResult[];
}

export function GeneImpactRadar({ results }: GeneImpactRadarProps) {
  // Prepare data for radar chart
  const data = results.map(result => {
    // Convert risk to numeric score
    const riskScores: Record<string, number> = {
      'Safe': 100,
      'Adjust Dosage': 60,
      'Ineffective': 30,
      'Toxic': 10,
      'Unknown': 50
    };
    
    return {
      drug: result.drug,
      score: riskScores[result.risk_assessment.risk_label] || 50,
      confidence: result.risk_assessment.confidence_score * 100
    };
  });
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Multi-Drug Risk Profile
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="drug"
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="Safety Score"
            dataKey="score"
            stroke="#0066B4"
            fill="#0066B4"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Confidence"
            dataKey="confidence"
            stroke="#00A3E0"
            fill="#00A3E0"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 opacity-30 rounded"></div>
          <span className="text-sm text-gray-700">Safety Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 opacity-20 rounded border-2 border-blue-400 border-dashed"></div>
          <span className="text-sm text-gray-700">Confidence</span>
        </div>
      </div>
    </Card>
  );
}
