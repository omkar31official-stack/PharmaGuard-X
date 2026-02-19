import React, { createContext, useContext, useState } from 'react';
import { DetectedVariant, AnalysisResult } from '../types/pharma';

interface AnalysisContextType {
  vcfFile: File | null;
  setVcfFile: (file: File | null) => void;
  detectedVariants: DetectedVariant[];
  setDetectedVariants: (variants: DetectedVariant[]) => void;
  analysisResults: AnalysisResult[];
  setAnalysisResults: (results: AnalysisResult[]) => void;
  patientId: string;
  setPatientId: (id: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [vcfFile, setVcfFile] = useState<File | null>(null);
  const [detectedVariants, setDetectedVariants] = useState<DetectedVariant[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [patientId, setPatientId] = useState('PGX-2024-0001');
  
  return (
    <AnalysisContext.Provider
      value={{
        vcfFile,
        setVcfFile,
        detectedVariants,
        setDetectedVariants,
        analysisResults,
        setAnalysisResults,
        patientId,
        setPatientId
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
