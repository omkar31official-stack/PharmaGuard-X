import { DrugName, Phenotype, GeneName, DetectedVariant, LLMGeneratedExplanation } from '../types/pharma';

/**
 * Generates structured clinical explanation for drug-gene interaction
 */
export function generateExplanation(
  drug: DrugName,
  gene: GeneName,
  phenotype: Phenotype,
  diplotype: string,
  variants: DetectedVariant[]
): LLMGeneratedExplanation {
  const explanations: Record<DrugName, {
    mechanism: string;
    phenotypeImpact: Record<Phenotype, string>;
  }> = {
    CODEINE: {
      mechanism: 'Codeine is a prodrug requiring CYP2D6-mediated O-demethylation to convert into morphine, its active form. CYP2D6 enzyme activity directly determines the rate of this bioactivation.',
      phenotypeImpact: {
        'PM': 'The detected CYP2D6 poor metabolizer phenotype results in complete loss of enzyme function, significantly reducing morphine production. This leads to ineffective analgesia and potential treatment failure.',
        'IM': 'The intermediate metabolizer phenotype indicates reduced CYP2D6 activity, resulting in decreased morphine formation. Patients may experience suboptimal pain relief at standard doses.',
        'NM': 'Normal CYP2D6 metabolizer status indicates standard enzyme function with expected codeine-to-morphine conversion rates, supporting standard dosing protocols.',
        'RM': 'Rapid metabolizer phenotype suggests enhanced CYP2D6 activity, potentially leading to faster morphine formation and risk of increased opioid effects.',
        'URM': 'Ultrarapid metabolizer status indicates excessive CYP2D6 activity, resulting in rapid and extensive morphine production. This significantly increases risks of respiratory depression, sedation, and toxicity.',
        'Unknown': 'Insufficient genetic data to determine CYP2D6 metabolizer status. Clinical response may be unpredictable.'
      }
    },
    WARFARIN: {
      mechanism: 'Warfarin undergoes hepatic metabolism primarily via CYP2C9, with the S-enantiomer (more potent) being the main substrate. VKORC1 encodes the target enzyme vitamin K epoxide reductase complex 1.',
      phenotypeImpact: {
        'PM': 'Poor metabolizer phenotype results in reduced warfarin clearance, leading to prolonged drug exposure and increased anticoagulant effect. Significant dose reduction required to prevent bleeding complications.',
        'IM': 'Intermediate metabolizer status indicates moderately reduced CYP2C9 activity, requiring careful dose titration with pharmacogenomic-guided dosing algorithms.',
        'NM': 'Normal metabolizer phenotype supports standard warfarin dosing initiation protocols with routine INR monitoring.',
        'RM': 'Enhanced CYP2C9 activity may necessitate higher warfarin doses to achieve therapeutic anticoagulation.',
        'URM': 'Extensive CYP2C9 activity could require substantially higher doses for therapeutic effect.',
        'Unknown': 'Genetic factors affecting warfarin response unclear. Use standard dosing with close INR monitoring.'
      }
    },
    CLOPIDOGREL: {
      mechanism: 'Clopidogrel is a prodrug requiring CYP2C19-mediated bioactivation to its active thiol metabolite, which irreversibly inhibits the P2Y12 receptor on platelets.',
      phenotypeImpact: {
        'PM': 'Poor metabolizer phenotype results in minimal conversion to active metabolite, leading to insufficient platelet inhibition and increased cardiovascular event risk despite therapy.',
        'IM': 'Intermediate metabolizer status indicates reduced bioactivation efficiency, potentially compromising antiplatelet efficacy. Consider alternative P2Y12 inhibitors.',
        'NM': 'Normal metabolizer phenotype ensures adequate clopidogrel activation and expected antiplatelet response.',
        'RM': 'Rapid metabolizer status suggests enhanced clopidogrel activation, supporting good antiplatelet response.',
        'URM': 'Ultrarapid metabolism may lead to excessive active metabolite formation, potentially increasing bleeding risk.',
        'Unknown': 'CYP2C19 metabolizer status undetermined. Platelet function testing may be warranted.'
      }
    },
    SIMVASTATIN: {
      mechanism: 'SLCO1B1 encodes organic anion-transporting polypeptide 1B1 (OATP1B1), which mediates hepatic uptake of statins including simvastatin. Reduced function impairs drug clearance.',
      phenotypeImpact: {
        'PM': 'Poor transporter function results in elevated systemic simvastatin concentrations, dramatically increasing myopathy and rhabdomyolysis risk. High-dose simvastatin contraindicated.',
        'IM': 'Intermediate function status indicates moderately impaired hepatic uptake. Limit simvastatin to ≤20mg daily or consider alternative statins.',
        'NM': 'Normal SLCO1B1 function supports standard simvastatin dosing with routine safety monitoring.',
        'RM': 'Enhanced transporter function may reduce systemic exposure, potentially requiring standard or higher doses.',
        'URM': 'Extensive transporter activity results in efficient hepatic uptake and clearance.',
        'Unknown': 'SLCO1B1 status unclear. Use cautious dosing approach.'
      }
    },
    AZATHIOPRINE: {
      mechanism: 'Thiopurine S-methyltransferase (TPMT) catalyzes S-methylation of azathioprine metabolites. TPMT deficiency leads to accumulation of cytotoxic thioguanine nucleotides.',
      phenotypeImpact: {
        'PM': 'TPMT deficiency results in severe accumulation of active thioguanine nucleotides, causing life-threatening myelosuppression and pancytopenia. Azathioprine use generally contraindicated or requires extreme dose reduction (≤10%).',
        'IM': 'Intermediate TPMT activity leads to moderately increased thioguanine nucleotide levels. Require 30-70% dose reduction with intensive hematologic monitoring.',
        'NM': 'Normal TPMT activity supports standard azathioprine dosing with routine CBC monitoring.',
        'RM': 'Enhanced TPMT activity may reduce therapeutic efficacy at standard doses.',
        'URM': 'Extensive TPMT activity could necessitate higher doses for immunosuppressive effect.',
        'Unknown': 'TPMT status undetermined. Recommend enzyme activity testing before initiating therapy.'
      }
    },
    FLUOROURACIL: {
      mechanism: 'Dihydropyrimidine dehydrogenase (DPD), encoded by DPYD, is the rate-limiting enzyme in fluorouracil catabolism, metabolizing >80% of administered dose.',
      phenotypeImpact: {
        'PM': 'Complete or near-complete DPD deficiency results in severely impaired fluorouracil clearance, leading to life-threatening toxicities including severe neutropenia, mucositis, and neurotoxicity. Fluorouracil use contraindicated.',
        'IM': 'Partial DPD deficiency causes moderately reduced fluorouracil metabolism. Require initial dose reduction of 25-50% with careful toxicity monitoring and dose titration.',
        'NM': 'Normal DPD activity supports standard fluorouracil dosing protocols with routine chemotherapy monitoring.',
        'RM': 'Enhanced DPD activity may reduce drug exposure, potentially affecting therapeutic efficacy.',
        'URM': 'Extensive DPD activity could necessitate dose adjustments for optimal therapeutic effect.',
        'Unknown': 'DPD status unclear. Consider DPD testing before fluorouracil initiation due to severe toxicity risk.'
      }
    }
  };
  
  const drugInfo = explanations[drug];
  const summary = `${drug} pharmacotherapy in patients with ${gene} ${diplotype} diplotype (${phenotype} phenotype).`;
  const biological_mechanism = drugInfo.mechanism;
  const clinical_impact = drugInfo.phenotypeImpact[phenotype];
  const variant_citations = variants.map(v => `${v.rsid} (${v.gene}${v.allele})`);
  
  return {
    summary,
    biological_mechanism,
    variant_citations,
    clinical_impact
  };
}

/**
 * Generates patient-friendly explanation
 */
export function generatePatientExplanation(
  drug: DrugName,
  phenotype: Phenotype,
  recommendation: string
): string {
  const friendlyPhenotypes: Record<Phenotype, string> = {
    'PM': 'very slow metabolizer',
    'IM': 'slow metabolizer',
    'NM': 'normal metabolizer',
    'RM': 'fast metabolizer',
    'URM': 'very fast metabolizer',
    'Unknown': 'unknown metabolizer status'
  };
  
  return `Your genetic profile indicates you are a ${friendlyPhenotypes[phenotype]} of ${drug}. ${recommendation}`;
}
