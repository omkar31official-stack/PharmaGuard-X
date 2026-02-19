import { DrugName, AnalysisResult, DetectedVariant, GeneName } from '../types/pharma';
import { analyzeGene } from './genetic-analysis';
import { assessDrugRisk, calculateConfidenceScore, getClinicalRecommendation } from './risk-assessment';
import { generateExplanation } from './explanation-generator';

/**
 * Main analysis engine that processes genetic data and generates complete results
 */
export function performAnalysis(
  drug: DrugName,
  detectedVariants: DetectedVariant[],
  patientId: string = 'PGX-2024-0001'
): AnalysisResult {
  // Determine which gene is primary for this drug
  const drugGeneMap: Record<DrugName, GeneName> = {
    'CODEINE': 'CYP2D6',
    'WARFARIN': 'CYP2C9',
    'CLOPIDOGREL': 'CYP2C19',
    'SIMVASTATIN': 'SLCO1B1',
    'AZATHIOPRINE': 'TPMT',
    'FLUOROURACIL': 'DPYD'
  };
  
  const primaryGene = drugGeneMap[drug];
  
  // Analyze the primary gene
  const geneAnalysis = analyzeGene(primaryGene, detectedVariants);
  
  // Assess drug risk based on phenotype
  const riskAssessment = assessDrugRisk(drug, geneAnalysis.phenotype);
  
  // Calculate confidence score
  const genesAnalyzed = new Set(detectedVariants.map(v => v.gene));
  const confidenceScore = calculateConfidenceScore(
    detectedVariants.length,
    genesAnalyzed.size,
    geneAnalysis.phenotype
  );
  
  // Get clinical recommendation
  const clinicalRecommendation = getClinicalRecommendation(
    drug,
    riskAssessment.risk,
    geneAnalysis.phenotype
  );
  
  // Generate explanation
  const geneVariants = detectedVariants.filter(v => v.gene === primaryGene);
  const explanation = generateExplanation(
    drug,
    primaryGene,
    geneAnalysis.phenotype,
    geneAnalysis.diplotype,
    geneVariants
  );
  
  // Compile complete result
  const result: AnalysisResult = {
    patient_id: patientId,
    drug,
    timestamp: new Date().toISOString(),
    risk_assessment: {
      risk_label: riskAssessment.risk,
      confidence_score: confidenceScore,
      severity: riskAssessment.severity
    },
    pharmacogenomic_profile: {
      primary_gene: primaryGene,
      diplotype: geneAnalysis.diplotype,
      phenotype: geneAnalysis.phenotype,
      detected_variants: geneVariants
    },
    clinical_recommendation: clinicalRecommendation,
    llm_generated_explanation: explanation,
    quality_metrics: {
      vcf_parsing_success: true,
      variants_detected: detectedVariants.length,
      genes_analyzed: Array.from(genesAnalyzed) as GeneName[],
      validation_status: detectedVariants.length > 0 ? 'PASS' : 'WARNING'
    }
  };
  
  return result;
}

/**
 * Batch analysis for multiple drugs
 */
export function performBatchAnalysis(
  drugs: DrugName[],
  detectedVariants: DetectedVariant[],
  patientId: string = 'PGX-2024-0001'
): AnalysisResult[] {
  return drugs.map(drug => performAnalysis(drug, detectedVariants, patientId));
}
