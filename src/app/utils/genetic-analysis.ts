import { DetectedVariant, Phenotype, GeneName } from '../types/pharma';

/**
 * Diplotype configuration for different genes
 */
interface DiplotypeConfig {
  allele1: string;
  allele2: string;
  phenotype: Phenotype;
}

/**
 * Maps diplotypes to phenotypes for CYP2D6
 */
const CYP2D6_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*2': 'NM',
  '*1/*4': 'IM',
  '*1/*6': 'IM',
  '*1/*10': 'IM',
  '*1/*41': 'IM',
  '*2/*2': 'NM',
  '*2/*4': 'IM',
  '*4/*4': 'PM',
  '*4/*6': 'PM',
  '*4/*10': 'PM',
  '*6/*6': 'PM',
  '*10/*10': 'IM',
  '*10/*41': 'IM',
  '*41/*41': 'IM',
  '*1/*1xN': 'URM',
  '*2/*2xN': 'URM',
};

/**
 * Maps diplotypes to phenotypes for CYP2C19
 */
const CYP2C19_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*2': 'IM',
  '*1/*3': 'IM',
  '*1/*17': 'RM',
  '*2/*2': 'PM',
  '*2/*3': 'PM',
  '*2/*17': 'IM',
  '*3/*3': 'PM',
  '*17/*17': 'URM',
};

/**
 * Maps diplotypes to phenotypes for CYP2C9
 */
const CYP2C9_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*2': 'IM',
  '*1/*3': 'IM',
  '*2/*2': 'IM',
  '*2/*3': 'IM',
  '*3/*3': 'PM',
};

/**
 * Maps diplotypes to phenotypes for SLCO1B1
 */
const SLCO1B1_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*5': 'IM',
  '*1/*1B': 'NM',
  '*5/*5': 'PM',
  '*5/*1B': 'IM',
  '*1B/*1B': 'NM',
};

/**
 * Maps diplotypes to phenotypes for TPMT
 */
const TPMT_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*2': 'IM',
  '*1/*3A': 'IM',
  '*1/*3C': 'IM',
  '*2/*2': 'PM',
  '*2/*3A': 'PM',
  '*3A/*3A': 'PM',
  '*3A/*3C': 'PM',
  '*3C/*3C': 'PM',
};

/**
 * Maps diplotypes to phenotypes for DPYD
 */
const DPYD_DIPLOTYPES: Record<string, Phenotype> = {
  '*1/*1': 'NM',
  '*1/*2A': 'IM',
  '*1/*13': 'IM',
  '*1/D949V': 'IM',
  '*2A/*2A': 'PM',
  '*2A/*13': 'PM',
  '*13/*13': 'PM',
};

/**
 * Determines diplotype from detected variants for a gene
 */
export function determineDiplotype(gene: GeneName, variants: DetectedVariant[]): string {
  const geneVariants = variants.filter(v => v.gene === gene);
  
  if (geneVariants.length === 0) {
    return '*1/*1'; // Wild-type assumption
  }
  
  // Extract unique alleles
  const alleles = new Set(geneVariants.map(v => v.allele));
  const alleleArray = Array.from(alleles);
  
  // If only one allele detected, assume homozygous or heterozygous with wild-type
  if (alleleArray.length === 1) {
    // Check genotype to determine if homozygous
    const firstVariant = geneVariants[0];
    if (firstVariant.genotype.length === 2 && firstVariant.genotype[0] === firstVariant.genotype[1]) {
      // Homozygous variant
      return `${alleleArray[0]}/${alleleArray[0]}`;
    } else {
      // Heterozygous with wild-type
      return `*1/${alleleArray[0]}`;
    }
  }
  
  // If two alleles detected
  if (alleleArray.length >= 2) {
    return `${alleleArray[0]}/${alleleArray[1]}`;
  }
  
  return '*1/*1';
}

/**
 * Maps diplotype to phenotype for a specific gene
 */
export function mapDiplotypeToPhenotype(gene: GeneName, diplotype: string): Phenotype {
  // Normalize diplotype (order doesn't matter)
  const alleles = diplotype.split('/').sort();
  const normalizedDiplotype = alleles.join('/');
  
  let diplotypeMap: Record<string, Phenotype>;
  
  switch (gene) {
    case 'CYP2D6':
      diplotypeMap = CYP2D6_DIPLOTYPES;
      break;
    case 'CYP2C19':
      diplotypeMap = CYP2C19_DIPLOTYPES;
      break;
    case 'CYP2C9':
      diplotypeMap = CYP2C9_DIPLOTYPES;
      break;
    case 'SLCO1B1':
      diplotypeMap = SLCO1B1_DIPLOTYPES;
      break;
    case 'TPMT':
      diplotypeMap = TPMT_DIPLOTYPES;
      break;
    case 'DPYD':
      diplotypeMap = DPYD_DIPLOTYPES;
      break;
    default:
      return 'Unknown';
  }
  
  // Try normalized diplotype
  if (diplotypeMap[normalizedDiplotype]) {
    return diplotypeMap[normalizedDiplotype];
  }
  
  // Try reverse order
  const reversedDiplotype = alleles.reverse().join('/');
  if (diplotypeMap[reversedDiplotype]) {
    return diplotypeMap[reversedDiplotype];
  }
  
  // Default based on allele impacts
  const hasLossOfFunction = diplotype.includes('*4') || diplotype.includes('*2A') || 
                            diplotype.includes('*6') || diplotype.includes('*2') || 
                            diplotype.includes('*3');
  
  if (hasLossOfFunction) {
    return alleles[0] === alleles[1] ? 'PM' : 'IM';
  }
  
  return 'Unknown';
}

/**
 * Complete genetic analysis for a gene
 */
export function analyzeGene(gene: GeneName, variants: DetectedVariant[]): {
  diplotype: string;
  phenotype: Phenotype;
  variantsFound: number;
} {
  const diplotype = determineDiplotype(gene, variants);
  const phenotype = mapDiplotypeToPhenotype(gene, diplotype);
  const variantsFound = variants.filter(v => v.gene === gene).length;
  
  return {
    diplotype,
    phenotype,
    variantsFound
  };
}