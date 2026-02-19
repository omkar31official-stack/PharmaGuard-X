import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAnalysis } from '../context/AnalysisContext';
import { RiskCard } from '../components/RiskCard';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { GeneticProfileTable } from '../components/GeneticProfileTable';
import { ClinicalRecommendationPanel } from '../components/ClinicalRecommendationPanel';
import { ExplanationDisplay } from '../components/ExplanationDisplay';
import { JSONExporter } from '../components/JSONExporter';
import { GeneImpactRadar } from '../components/GeneImpactRadar';
import { DNAAnimation } from '../components/DNAAnimation';
import { toast } from 'sonner';

export function ResultsPage() {
  const navigate = useNavigate();
  const { analysisResults, patientId } = useAnalysis();
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  
  // Redirect if no results
  useEffect(() => {
    if (analysisResults.length === 0) {
      toast.error('No analysis results available');
      navigate('/');
    }
  }, [analysisResults, navigate]);
  
  if (analysisResults.length === 0) {
    return null;
  }
  
  const currentResult = analysisResults[selectedResultIndex];
  
  const handleDownloadAll = () => {
    const allResults = {
      patient_id: patientId,
      timestamp: new Date().toISOString(),
      results: analysisResults
    };
    
    const blob = new Blob([JSON.stringify(allResults, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmaguard-complete-analysis-${patientId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Complete analysis downloaded');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PharmaGuard X</h1>
                <p className="text-sm text-gray-600">
                  Analysis Results • Patient ID: {patientId}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadAll}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download All
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/select-drugs')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <DNAAnimation size="small" animate={false} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pharmacogenomic Analysis Complete
              </h2>
              <p className="text-gray-600">
                {analysisResults.length} drug{analysisResults.length > 1 ? 's' : ''} analyzed
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResults.map((result, index) => (
              <RiskCard
                key={index}
                drug={result.drug}
                risk={result.risk_assessment.risk_label}
                severity={result.risk_assessment.severity}
                confidence={result.risk_assessment.confidence_score}
                onClick={() => setSelectedResultIndex(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Multi-Drug Overview */}
        {analysisResults.length > 1 && (
          <div className="mb-8">
            <GeneImpactRadar results={analysisResults} />
          </div>
        )}
        
        {/* Detailed View */}
        <div>
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentResult.drug}
                </h2>
                <p className="text-sm text-gray-600">
                  Analyzed on {new Date(currentResult.timestamp).toLocaleString()}
                </p>
              </div>
              <ConfidenceMeter score={currentResult.risk_assessment.confidence_score} size="medium" />
            </div>
            
            {/* Drug Tabs if multiple */}
            {analysisResults.length > 1 && (
              <Tabs value={selectedResultIndex.toString()} onValueChange={(v) => setSelectedResultIndex(parseInt(v))}>
                <TabsList className="mb-6">
                  {analysisResults.map((result, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      {result.drug}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </Card>
          
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <GeneticProfileTable profile={currentResult.pharmacogenomic_profile} />
              <ClinicalRecommendationPanel
                recommendation={currentResult.clinical_recommendation}
                drugName={currentResult.drug}
              />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <ExplanationDisplay explanation={currentResult.llm_generated_explanation} />
              <JSONExporter result={currentResult} />
            </div>
          </div>
          
          {/* Quality Metrics */}
          <Card className="p-6 mt-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">VCF Parsing</span>
                <p className="text-lg font-semibold text-green-600">
                  {currentResult.quality_metrics.vcf_parsing_success ? '✓ Success' : '✗ Failed'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Variants Detected</span>
                <p className="text-lg font-semibold text-gray-900">
                  {currentResult.quality_metrics.variants_detected}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Genes Analyzed</span>
                <p className="text-lg font-semibold text-gray-900">
                  {currentResult.quality_metrics.genes_analyzed.length}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Validation Status</span>
                <p className="text-lg font-semibold text-blue-600">
                  {currentResult.quality_metrics.validation_status}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Clinical Disclaimer */}
          <Card className="p-6 mt-6 bg-yellow-50 border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">Clinical Use Disclaimer</h3>
            <p className="text-sm text-yellow-800 leading-relaxed">
              This pharmacogenomic analysis is provided for clinical decision support purposes. 
              Results should be interpreted by qualified healthcare professionals in conjunction 
              with patient medical history, concurrent medications, and clinical guidelines. 
              This tool does not replace professional medical judgment. For complex cases, 
              consultation with a clinical pharmacologist or pharmacogenomics specialist is recommended.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
