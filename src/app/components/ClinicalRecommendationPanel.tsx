import { AlertTriangle, Pill, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ClinicalRecommendation } from '../types/pharma';

interface ClinicalRecommendationPanelProps {
  recommendation: ClinicalRecommendation;
  drugName: string;
}

export function ClinicalRecommendationPanel({ recommendation, drugName }: ClinicalRecommendationPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-blue-600" />
        Clinical Recommendations
      </h3>
      
      <div className="space-y-6">
        {/* Primary Action */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Recommended Action</h4>
              <p className="text-gray-700">{recommendation.action}</p>
            </div>
          </div>
        </div>
        
        {/* Alternative Medications */}
        {recommendation.alternatives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Alternative Medications</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendation.alternatives.map((alt, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1">
                  {alt}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Monitoring Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Monitoring Requirements</h4>
          </div>
          <p className="text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {recommendation.monitoring}
          </p>
        </div>
        
        {/* Clinical Note */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>Clinical Note:</strong> These recommendations are based on pharmacogenomic 
            guidelines and should be interpreted in the context of the patient's complete clinical 
            picture. Consult with a clinical pharmacologist or genetic counselor for complex cases.
          </p>
        </div>
      </div>
    </Card>
  );
}
