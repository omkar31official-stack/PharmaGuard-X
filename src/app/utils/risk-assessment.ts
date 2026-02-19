import { DrugName, RiskLabel, Severity, Phenotype, GeneName } from '../types/pharma';

/**
 * Drug-Gene interaction rules
 */
interface DrugGeneRule {
  primaryGene: GeneName;
  secondaryGenes?: GeneName[];
  phenotypeRisks: Record<Phenotype, RiskLabel>;
}

/**
 * Drug interaction rules database
 */
const DRUG_GENE_RULES: Record<DrugName, DrugGeneRule> = {
  CODEINE: {
    primaryGene: 'CYP2D6',
    phenotypeRisks: {
      'PM': 'Ineffective',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Adjust Dosage',
      'URM': 'Toxic',
      'Unknown': 'Unknown'
    }
  },
  WARFARIN: {
    primaryGene: 'CYP2C9',
    secondaryGenes: ['VKORC1'],
    phenotypeRisks: {
      'PM': 'Adjust Dosage',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Safe',
      'URM': 'Safe',
      'Unknown': 'Unknown'
    }
  },
  CLOPIDOGREL: {
    primaryGene: 'CYP2C19',
    phenotypeRisks: {
      'PM': 'Ineffective',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Safe',
      'URM': 'Toxic',
      'Unknown': 'Unknown'
    }
  },
  SIMVASTATIN: {
    primaryGene: 'SLCO1B1',
    phenotypeRisks: {
      'PM': 'Toxic',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Safe',
      'URM': 'Safe',
      'Unknown': 'Unknown'
    }
  },
  AZATHIOPRINE: {
    primaryGene: 'TPMT',
    phenotypeRisks: {
      'PM': 'Toxic',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Safe',
      'URM': 'Safe',
      'Unknown': 'Unknown'
    }
  },
  FLUOROURACIL: {
    primaryGene: 'DPYD',
    phenotypeRisks: {
      'PM': 'Toxic',
      'IM': 'Adjust Dosage',
      'NM': 'Safe',
      'RM': 'Safe',
      'URM': 'Safe',
      'Unknown': 'Unknown'
    }
  }
};

/**
 * Maps risk labels to severity levels
 */
const RISK_SEVERITY_MAP: Record<RiskLabel, Severity> = {
  'Safe': 'none',
  'Adjust Dosage': 'moderate',
  'Toxic': 'critical',
  'Ineffective': 'high',
  'Unknown': 'low'
};

/**
 * Assesses risk for a drug based on phenotype
 */
export function assessDrugRisk(
  drug: DrugName,
  phenotype: Phenotype
): { risk: RiskLabel; severity: Severity; primaryGene: GeneName } {
  const rule = DRUG_GENE_RULES[drug];
  const risk = rule.phenotypeRisks[phenotype] || 'Unknown';
  const severity = RISK_SEVERITY_MAP[risk];
  
  return {
    risk,
    severity,
    primaryGene: rule.primaryGene
  };
}

/**
 * Calculates confidence score based on genetic data quality
 */
export function calculateConfidenceScore(
  variantsDetected: number,
  genesAnalyzed: number,
  phenotype: Phenotype
): number {
  // Gene match strength (0-1)
  const geneMatchStrength = genesAnalyzed > 0 ? 1.0 : 0.0;
  
  // Variant completeness (0-1)
  const variantCompleteness = Math.min(variantsDetected / 5, 1.0);
  
  // Evidence weight (0-1) - higher for non-unknown phenotypes
  const evidenceWeight = phenotype !== 'Unknown' ? 1.0 : 0.3;
  
  // Data validation (0-1) - assumes VCF is valid if we got here
  const dataValidation = 1.0;
  
  // Weighted calculation
  const confidence = 
    (0.4 * geneMatchStrength) +
    (0.3 * variantCompleteness) +
    (0.2 * evidenceWeight) +
    (0.1 * dataValidation);
  
  return Math.round(confidence * 100) / 100; // Round to 2 decimal places
}

/**
 * Gets color coding for risk level
 */
export function getRiskColor(risk: RiskLabel): string {
  switch (risk) {
    case 'Safe':
      return 'green';
    case 'Adjust Dosage':
      return 'yellow';
    case 'Toxic':
    case 'Ineffective':
      return 'red';
    case 'Unknown':
      return 'gray';
    default:
      return 'gray';
  }
}

/**
 * Gets clinical recommendations based on drug and risk
 */
export function getClinicalRecommendation(
  drug: DrugName,
  risk: RiskLabel,
  phenotype: Phenotype
): { action: string; alternatives: string[]; monitoring: string } {
  const recommendations: Record<DrugName, Record<RiskLabel, {
    action: string;
    alternatives: string[];
    monitoring: string;
  }>> = {
    CODEINE: {
      'Ineffective': {
        action: 'Avoid codeine use',
        alternatives: ['Morphine', 'Hydromorphone', 'Non-opioid analgesics'],
        monitoring: 'Assess pain response, consider alternative analgesics'
      },
      'Toxic': {
        action: 'Avoid codeine or use minimal doses',
        alternatives: ['Morphine', 'Hydromorphone', 'Tramadol'],
        monitoring: 'Monitor for respiratory depression and sedation'
      },
      'Adjust Dosage': {
        action: 'Consider dose adjustment based on phenotype',
        alternatives: ['Alternative opioids if inadequate response'],
        monitoring: 'Monitor analgesic efficacy and adverse effects'
      },
      'Safe': {
        action: 'Use standard dosing',
        alternatives: [],
        monitoring: 'Standard pain assessment'
      },
      'Unknown': {
        action: 'Use with caution, monitor closely',
        alternatives: ['Consider alternative analgesics'],
        monitoring: 'Enhanced monitoring for efficacy and safety'
      }
    },
    WARFARIN: {
      'Adjust Dosage': {
        action: 'Use pharmacogenomic-guided dosing',
        alternatives: ['Direct oral anticoagulants (DOACs)'],
        monitoring: 'Frequent INR monitoring, target INR 2-3'
      },
      'Safe': {
        action: 'Use standard dosing protocol',
        alternatives: [],
        monitoring: 'Standard INR monitoring'
      },
      'Unknown': {
        action: 'Use standard dosing with enhanced monitoring',
        alternatives: ['Consider DOACs'],
        monitoring: 'Frequent INR checks initially'
      },
      'Toxic': {
        action: 'Start with reduced dose',
        alternatives: ['Direct oral anticoagulants'],
        monitoring: 'Very frequent INR monitoring'
      },
      'Ineffective': {
        action: 'May require higher doses',
        alternatives: ['Alternative anticoagulants'],
        monitoring: 'Close INR monitoring'
      }
    },
    CLOPIDOGREL: {
      'Ineffective': {
        action: 'Avoid clopidogrel',
        alternatives: ['Prasugrel', 'Ticagrelor'],
        monitoring: 'Consider platelet function testing'
      },
      'Toxic': {
        action: 'Use alternative P2Y12 inhibitor',
        alternatives: ['Prasugrel', 'Ticagrelor'],
        monitoring: 'Monitor for bleeding'
      },
      'Adjust Dosage': {
        action: 'Consider higher dose or alternative',
        alternatives: ['Prasugrel', 'Ticagrelor'],
        monitoring: 'Platelet function testing recommended'
      },
      'Safe': {
        action: 'Use standard dosing',
        alternatives: [],
        monitoring: 'Standard cardiovascular monitoring'
      },
      'Unknown': {
        action: 'Use with caution',
        alternatives: ['Consider platelet function testing'],
        monitoring: 'Enhanced monitoring for efficacy'
      }
    },
    SIMVASTATIN: {
      'Toxic': {
        action: 'Avoid high-dose simvastatin (>20mg)',
        alternatives: ['Pravastatin', 'Rosuvastatin (low dose)', 'Atorvastatin'],
        monitoring: 'Monitor for myopathy, CK levels'
      },
      'Adjust Dosage': {
        action: 'Use lower dose (≤20mg)',
        alternatives: ['Alternative statins'],
        monitoring: 'Monitor CK and muscle symptoms'
      },
      'Safe': {
        action: 'Use standard dosing',
        alternatives: [],
        monitoring: 'Standard lipid panel and safety monitoring'
      },
      'Unknown': {
        action: 'Start with lower dose',
        alternatives: ['Consider alternative statins'],
        monitoring: 'Monitor CK and muscle symptoms closely'
      },
      'Ineffective': {
        action: 'May use standard doses',
        alternatives: [],
        monitoring: 'Monitor lipid response'
      }
    },
    AZATHIOPRINE: {
      'Toxic': {
        action: 'Avoid azathioprine or use 10% of standard dose',
        alternatives: ['Mycophenolate', 'Methotrexate'],
        monitoring: 'Weekly CBC if used'
      },
      'Adjust Dosage': {
        action: 'Reduce dose to 30-70% of standard',
        alternatives: ['Alternative immunosuppressants'],
        monitoring: 'Frequent CBC monitoring'
      },
      'Safe': {
        action: 'Use standard dosing',
        alternatives: [],
        monitoring: 'Standard CBC monitoring'
      },
      'Unknown': {
        action: 'Start with reduced dose',
        alternatives: ['TPMT enzyme testing recommended'],
        monitoring: 'Close CBC monitoring'
      },
      'Ineffective': {
        action: 'May use standard or higher doses',
        alternatives: [],
        monitoring: 'Monitor therapeutic response and CBC'
      }
    },
    FLUOROURACIL: {
      'Toxic': {
        action: 'Avoid fluorouracil',
        alternatives: ['Alternative chemotherapy regimens'],
        monitoring: 'Consider DPD activity testing'
      },
      'Adjust Dosage': {
        action: 'Reduce dose by 25-50%',
        alternatives: ['Alternative chemotherapy agents'],
        monitoring: 'Enhanced monitoring for toxicity'
      },
      'Safe': {
        action: 'Use standard dosing',
        alternatives: [],
        monitoring: 'Standard chemotherapy monitoring'
      },
      'Unknown': {
        action: 'Use with caution, consider dose reduction',
        alternatives: ['DPD testing recommended'],
        monitoring: 'Close monitoring for toxicity'
      },
      'Ineffective': {
        action: 'May use standard doses',
        alternatives: [],
        monitoring: 'Monitor therapeutic response'
      }
    }
  };
  
  return recommendations[drug]?.[risk] || {
    action: 'Consult clinical pharmacologist',
    alternatives: [],
    monitoring: 'Close clinical monitoring'
  };
}
