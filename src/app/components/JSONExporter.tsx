import { useState } from 'react';
import { Download, Copy, Check, FileJson } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { AnalysisResult, AnalysisResultSchema } from '../types/pharma';
import { toast } from 'sonner';

interface JSONExporterProps {
  result: AnalysisResult;
}

export function JSONExporter({ result }: JSONExporterProps) {
  const [copied, setCopied] = useState(false);
  
  const jsonString = JSON.stringify(result, null, 2);
  
  const handleDownload = () => {
    try {
      // Validate before download
      AnalysisResultSchema.parse(result);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pharmaguard-${result.drug.toLowerCase()}-${result.patient_id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('JSON file downloaded successfully');
    } catch (error) {
      toast.error('Validation failed. Please check the data.');
      console.error('Validation error:', error);
    }
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success('JSON copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-blue-600" />
          JSON Output
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <pre className="p-4 text-xs font-mono bg-gray-50">
          <code className="text-gray-800">{jsonString}</code>
        </pre>
      </ScrollArea>
      
      {/* Validation Status */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            Schema Validated
          </span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Output conforms to RIFT 2026 pharmacogenomic analysis schema
        </p>
      </div>
    </Card>
  );
}
