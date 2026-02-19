import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Dna, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { LLMGeneratedExplanation } from '../types/pharma';

interface ExplanationDisplayProps {
  explanation: LLMGeneratedExplanation;
}

export function ExplanationDisplay({ explanation }: ExplanationDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Card className="p-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Clinical Explanation
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              {isOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-6">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-blue-600 rounded"></div>
              <h4 className="font-semibold text-gray-900">Summary</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-3">
              {explanation.summary}
            </p>
          </div>
          
          {/* Biological Mechanism */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Biological Mechanism</h4>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-sm">
                {explanation.biological_mechanism}
              </p>
            </div>
          </div>
          
          {/* Variant Citations */}
          {explanation.variant_citations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">Evidence</Badge>
                <h4 className="font-semibold text-gray-900">Variant Citations</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {explanation.variant_citations.map((citation, idx) => (
                  <Badge key={idx} className="bg-gray-100 text-gray-800 font-mono text-xs">
                    {citation}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Clinical Impact */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Clinical Impact</h4>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed text-sm">
                {explanation.clinical_impact}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
