import { z } from 'zod';

// Supported drugs
export const DRUGS = [
  'CODEINE',
  'WARFARIN',
  'CLOPIDOGREL',
  'SIMVASTATIN',
  'AZATHIOPRINE',
  'FLUOROURACIL'
] as const;

export type DrugName = typeof DRUGS[number];

// Risk labels
export type RiskLabel = 'Safe' | 'Adjust Dosage' | 'Toxic' | 'Ineffective' | 'Unknown';

// Severity levels
export type Severity = 'none' | 'low' | 'moderate' | 'high' | 'critical';

// Phenotypes
export type Phenotype = 'PM' | 'IM' | 'NM' | 'RM' | 'URM' | 'Unknown';

// Gene names
export const GENES = ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD', 'VKORC1'] as const;
export type GeneName = typeof GENES[number];

// VCF Variant
export interface VCFVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: string;
  filter: string;
  info: string;
  format?: string;
  sample?: string;
}

// Detected Variant
export interface DetectedVariant {
  rsid: string;
  gene: GeneName;
  allele: string;
  genotype: string;
  impact: string;
}

// Pharmacogenomic Profile
export interface PharmacogenomicProfile {
  primary_gene: GeneName;
  diplotype: string;
  phenotype: Phenotype;
  detected_variants: DetectedVariant[];
}

// Risk Assessment
export interface RiskAssessment {
  risk_label: RiskLabel;
  confidence_score: number;
  severity: Severity;
}

// Clinical Recommendation
export interface ClinicalRecommendation {
  action: string;
  alternatives: string[];
  monitoring: string;
}

// LLM Generated Explanation
export interface LLMGeneratedExplanation {
  summary: string;
  biological_mechanism: string;
  variant_citations: string[];
  clinical_impact: string;
}

// Quality Metrics
export interface QualityMetrics {
  vcf_parsing_success: boolean;
  variants_detected: number;
  genes_analyzed: GeneName[];
  validation_status: 'PASS' | 'FAIL' | 'WARNING';
}

// Complete Analysis Result
export interface AnalysisResult {
  patient_id: string;
  drug: DrugName;
  timestamp: string;
  risk_assessment: RiskAssessment;
  pharmacogenomic_profile: PharmacogenomicProfile;
  clinical_recommendation: ClinicalRecommendation;
  llm_generated_explanation: LLMGeneratedExplanation;
  quality_metrics: QualityMetrics;
}

// Zod Schema for validation
export const AnalysisResultSchema = z.object({
  patient_id: z.string(),
  drug: z.enum(DRUGS),
  timestamp: z.string(),
  risk_assessment: z.object({
    risk_label: z.enum(['Safe', 'Adjust Dosage', 'Toxic', 'Ineffective', 'Unknown']),
    confidence_score: z.number().min(0).max(1),
    severity: z.enum(['none', 'low', 'moderate', 'high', 'critical'])
  }),
  pharmacogenomic_profile: z.object({
    primary_gene: z.enum(GENES),
    diplotype: z.string(),
    phenotype: z.enum(['PM', 'IM', 'NM', 'RM', 'URM', 'Unknown']),
    detected_variants: z.array(z.object({
      rsid: z.string(),
      gene: z.enum(GENES),
      allele: z.string(),
      genotype: z.string(),
      impact: z.string()
    }))
  }),
  clinical_recommendation: z.object({
    action: z.string(),
    alternatives: z.array(z.string()),
    monitoring: z.string()
  }),
  llm_generated_explanation: z.object({
    summary: z.string(),
    biological_mechanism: z.string(),
    variant_citations: z.array(z.string()),
    clinical_impact: z.string()
  }),
  quality_metrics: z.object({
    vcf_parsing_success: z.boolean(),
    variants_detected: z.number(),
    genes_analyzed: z.array(z.enum(GENES)),
    validation_status: z.enum(['PASS', 'FAIL', 'WARNING'])
  })
});
