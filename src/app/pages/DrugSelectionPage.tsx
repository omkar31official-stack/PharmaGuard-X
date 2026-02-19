import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Pill, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { DNAAnimation } from '../components/DNAAnimation';
import { useAnalysis } from '../context/AnalysisContext';
import { performBatchAnalysis } from '../utils/analysis-engine';
import { DRUGS, DrugName } from '../types/pharma';
import { toast } from 'sonner';

const DRUG_INFO: Record<DrugName, { category: string; description: string }> = {
  CODEINE: {
    category: 'Opioid Analgesic',
    description: 'Pain management requiring CYP2D6 activation'
  },
  WARFARIN: {
    category: 'Anticoagulant',
    description: 'Blood thinner metabolized by CYP2C9'
  },
  CLOPIDOGREL: {
    category: 'Antiplatelet',
    description: 'Platelet inhibitor requiring CYP2C19 activation'
  },
  SIMVASTATIN: {
    category: 'Statin',
    description: 'Cholesterol medication transported by SLCO1B1'
  },
  AZATHIOPRINE: {
    category: 'Immunosuppressant',
    description: 'Immune system suppressor metabolized by TPMT'
  },
  FLUOROURACIL: {
    category: 'Chemotherapy',
    description: 'Cancer treatment metabolized by DPYD'
  }
};

export function DrugSelectionPage() {
  const navigate = useNavigate();
  const { detectedVariants, setAnalysisResults, vcfFile } = useAnalysis();
  const [selectedDrugs, setSelectedDrugs] = useState<DrugName[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Redirect if no VCF data
  useEffect(() => {
    if (!vcfFile || detectedVariants.length === 0) {
      toast.error('Please upload a VCF file first');
      navigate('/');
    }
  }, [vcfFile, detectedVariants, navigate]);
  
  const handleDrugToggle = (drug: DrugName) => {
    setSelectedDrugs(prev =>
      prev.includes(drug)
        ? prev.filter(d => d !== drug)
        : [...prev, drug]
    );
  };
  
  const handleAnalyze = async () => {
    if (selectedDrugs.length === 0) {
      toast.error('Please select at least one drug');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Perform analysis
      const results = performBatchAnalysis(selectedDrugs, detectedVariants);
      setAnalysisResults(results);
      
      toast.success(`Analysis complete for ${selectedDrugs.length} drug(s)`);
      
      // Navigate to results
      navigate('/results');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PharmaGuard X</h1>
                <p className="text-sm text-gray-600">Drug Selection</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                ✓
              </div>
              <span className="text-sm font-medium text-gray-700">VCF Upload</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Drug Selection</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Results</span>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="text-center mb-8">
            <DNAAnimation size="medium" animate={false} />
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">
              Select Medications for Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose one or more drugs to receive personalized pharmacogenomic recommendations 
              based on your genetic profile.
            </p>
          </div>
          
          {/* Genetic Data Summary */}
          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Genetic Data Loaded</h3>
                <p className="text-sm text-gray-700">
                  <strong>{detectedVariants.length}</strong> pharmacogenomic variants detected across{' '}
                  <strong>{new Set(detectedVariants.map(v => v.gene)).size}</strong> genes
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.from(new Set(detectedVariants.map(v => v.gene))).map(gene => (
                    <Badge key={gene} variant="secondary" className="bg-white">
                      {gene}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Drug Selection Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {DRUGS.map(drug => {
              const info = DRUG_INFO[drug];
              const isSelected = selectedDrugs.includes(drug);
              
              return (
                <Card
                  key={drug}
                  className={`
                    p-6 cursor-pointer transition-all
                    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg hover:border-gray-300'}
                  `}
                  onClick={() => handleDrugToggle(drug)}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleDrugToggle(drug)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{drug}</h3>
                        <Badge variant="outline" className="ml-2">
                          {info.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedDrugs.length > 0 ? (
                <span>
                  <strong>{selectedDrugs.length}</strong> drug{selectedDrugs.length > 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>No drugs selected</span>
              )}
            </div>
            
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={selectedDrugs.length === 0 || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Selected Drugs'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
