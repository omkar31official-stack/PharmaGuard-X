import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { DNAAnimation } from '../components/DNAAnimation';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { useAnalysis } from '../context/AnalysisContext';
import { parseVCFFile } from '../utils/vcf-parser';
import { downloadSampleVCF } from '../utils/sample-vcf';
import { toast } from 'sonner';

export function LandingPage() {
  const navigate = useNavigate();
  const { setVcfFile, setDetectedVariants } = useAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsProcessing(true);
    setProgress(10);
    
    try {
      // Simulate progress
      setProgress(30);
      
      // Parse VCF file
      const result = await parseVCFFile(file);
      setProgress(70);
      
      if (!result.success || !result.detectedVariants) {
        throw new Error(result.error || 'Failed to parse VCF file');
      }
      
      setProgress(90);
      
      // Store in context
      setVcfFile(file);
      setDetectedVariants(result.detectedVariants);
      
      setProgress(100);
      setSuccess(true);
      
      toast.success(`Successfully parsed VCF file: ${result.detectedVariants.length} pharmacogenomic variants detected`);
      
      // Navigate to drug selection after short delay
      setTimeout(() => {
        navigate('/select-drugs');
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [setVcfFile, setDetectedVariants, navigate]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const vcfFile = files.find(f => f.name.endsWith('.vcf'));
    
    if (vcfFile) {
      handleFile(vcfFile);
    } else {
      setError('Please upload a VCF file (.vcf)');
      toast.error('Invalid file type. Please upload a VCF file.');
    }
  }, [handleFile]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PharmaGuard X</h1>
              <p className="text-sm text-gray-600">Clinical Pharmacogenomic Decision Support</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <DNAAnimation size="large" animate={!isProcessing} />
            <h2 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
              Transform Genetic Data Into Clinical Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your VCF file to receive evidence-based pharmacogenomic recommendations 
              for safer, more effective medication prescribing.
            </p>
          </div>
          
          {/* Upload Card */}
          <Card className="p-8 mb-6">
            <div
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-all
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload VCF File
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your VCF file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports VCF v4.2 format • Maximum file size: 5MB
                  </p>
                </div>
                
                <input
                  type="file"
                  id="vcf-upload"
                  accept=".vcf"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isProcessing}
                />
                
                <Button
                  size="lg"
                  onClick={() => document.getElementById('vcf-upload')?.click()}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select VCF File
                </Button>
              </div>
            </div>
            
            {/* Progress Indicator */}
            {isProcessing && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Processing VCF file...</span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Success Alert */}
            {success && (
              <Alert className="mt-6 border-green-200 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  VCF file successfully validated. Redirecting to drug selection...
                </AlertDescription>
              </Alert>
            )}
          </Card>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">VCF Parsing</h3>
              <p className="text-sm text-gray-600">
                Extracts pharmacogenomic variants for 6 critical genes with clinical validation
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <p className="text-sm text-gray-600">
                CPIC guideline-aligned predictions with confidence scoring and severity levels
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Clinical Guidance</h3>
              <p className="text-sm text-gray-600">
                Actionable recommendations with alternative medications and monitoring protocols
              </p>
            </Card>
          </div>
          
          {/* Supported Genes */}
          <Card className="p-6 mt-8 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Analyzed Genes</h3>
            <div className="flex flex-wrap gap-2">
              {['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'].map(gene => (
                <span
                  key={gene}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-mono text-gray-700"
                >
                  {gene}
                </span>
              ))}
            </div>
          </Card>
          
          {/* Sample VCF Download */}
          <Card className="p-6 mt-8 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Sample VCF File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download a sample VCF file to test the system
            </p>
            <Button
              size="sm"
              onClick={downloadSampleVCF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Sample VCF
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}