import { VCFVariant, DetectedVariant, GeneName } from '../types/pharma';

// Known pharmacogenomic variants
const PHARMACOGENOMIC_VARIANTS: Record<string, { gene: GeneName; allele: string; impact: string }> = {
  // CYP2D6
  'rs3892097': { gene: 'CYP2D6', allele: '*4', impact: 'Loss of function' },
  'rs1065852': { gene: 'CYP2D6', allele: '*10', impact: 'Reduced function' },
  'rs28371725': { gene: 'CYP2D6', allele: '*41', impact: 'Reduced function' },
  'rs5030655': { gene: 'CYP2D6', allele: '*6', impact: 'Loss of function' },
  
  // CYP2C19
  'rs4244285': { gene: 'CYP2C19', allele: '*2', impact: 'Loss of function' },
  'rs4986893': { gene: 'CYP2C19', allele: '*3', impact: 'Loss of function' },
  'rs12248560': { gene: 'CYP2C19', allele: '*17', impact: 'Increased function' },
  
  // CYP2C9
  'rs1799853': { gene: 'CYP2C9', allele: '*2', impact: 'Reduced function' },
  'rs1057910': { gene: 'CYP2C9', allele: '*3', impact: 'Reduced function' },
  
  // SLCO1B1
  'rs4149056': { gene: 'SLCO1B1', allele: '*5', impact: 'Reduced function' },
  'rs2306283': { gene: 'SLCO1B1', allele: '*1B', impact: 'Normal function' },
  
  // TPMT
  'rs1800462': { gene: 'TPMT', allele: '*2', impact: 'Loss of function' },
  'rs1800460': { gene: 'TPMT', allele: '*3A', impact: 'Loss of function' },
  'rs1142345': { gene: 'TPMT', allele: '*3C', impact: 'Loss of function' },
  
  // DPYD
  'rs3918290': { gene: 'DPYD', allele: '*2A', impact: 'Loss of function' },
  'rs55886062': { gene: 'DPYD', allele: '*13', impact: 'Loss of function' },
  'rs67376798': { gene: 'DPYD', allele: 'D949V', impact: 'Reduced function' },
  
  // VKORC1
  'rs9923231': { gene: 'VKORC1', allele: '-1639G>A', impact: 'Reduced function' },
};

export class VCFParser {
  private fileContent: string;
  private variants: VCFVariant[] = [];
  
  constructor(fileContent: string) {
    this.fileContent = fileContent;
  }
  
  /**
   * Validates VCF file structure
   */
  validate(): { valid: boolean; error?: string } {
    const lines = this.fileContent.split('\n');
    
    // Check for VCF header
    if (!lines[0]?.startsWith('##fileformat=VCF')) {
      return { valid: false, error: 'Invalid VCF file: Missing fileformat header' };
    }
    
    // Check for version
    const versionMatch = lines[0].match(/VCFv(\d+\.\d+)/);
    if (!versionMatch) {
      return { valid: false, error: 'Invalid VCF file: Cannot parse version' };
    }
    
    // Check for column header
    const headerLine = lines.find(line => line.startsWith('#CHROM'));
    if (!headerLine) {
      return { valid: false, error: 'Invalid VCF file: Missing column header' };
    }
    
    return { valid: true };
  }
  
  /**
   * Parses VCF file and extracts variants
   */
  parse(): VCFVariant[] {
    const lines = this.fileContent.split('\n');
    const variants: VCFVariant[] = [];
    
    for (const line of lines) {
      // Skip headers and empty lines
      if (line.startsWith('#') || line.trim() === '') continue;
      
      const fields = line.split('\t');
      if (fields.length < 8) continue;
      
      variants.push({
        chrom: fields[0],
        pos: parseInt(fields[1]),
        id: fields[2],
        ref: fields[3],
        alt: fields[4],
        qual: fields[5],
        filter: fields[6],
        info: fields[7],
        format: fields[8],
        sample: fields[9]
      });
    }
    
    this.variants = variants;
    return variants;
  }
  
  /**
   * Extracts pharmacogenomic variants from parsed VCF
   */
  extractPharmacogenomicVariants(): DetectedVariant[] {
    const detected: DetectedVariant[] = [];
    
    for (const variant of this.variants) {
      // Check if this is a known pharmacogenomic variant
      const rsid = variant.id;
      
      if (rsid !== '.' && PHARMACOGENOMIC_VARIANTS[rsid]) {
        const variantInfo = PHARMACOGENOMIC_VARIANTS[rsid];
        
        // Determine genotype from sample field
        let genotype = 'Unknown';
        if (variant.sample) {
          const gt = variant.sample.split(':')[0];
          if (gt === '0/0' || gt === '0|0') genotype = variant.ref + variant.ref;
          else if (gt === '0/1' || gt === '0|1' || gt === '1/0' || gt === '1|0') genotype = variant.ref + variant.alt;
          else if (gt === '1/1' || gt === '1|1') genotype = variant.alt + variant.alt;
        }
        
        detected.push({
          rsid,
          gene: variantInfo.gene,
          allele: variantInfo.allele,
          genotype,
          impact: variantInfo.impact
        });
      }
    }
    
    return detected;
  }
  
  /**
   * Gets all variants for a specific gene
   */
  getVariantsForGene(gene: GeneName): DetectedVariant[] {
    const allVariants = this.extractPharmacogenomicVariants();
    return allVariants.filter(v => v.gene === gene);
  }
}

/**
 * Parses VCF file from File object
 */
export async function parseVCFFile(file: File): Promise<{
  success: boolean;
  variants?: VCFVariant[];
  detectedVariants?: DetectedVariant[];
  error?: string;
}> {
  try {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit' };
    }
    
    // Read file content
    const content = await file.text();
    
    // Parse VCF
    const parser = new VCFParser(content);
    
    // Validate
    const validation = parser.validate();
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    // Parse variants
    const variants = parser.parse();
    const detectedVariants = parser.extractPharmacogenomicVariants();
    
    return {
      success: true,
      variants,
      detectedVariants
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing VCF file'
    };
  }
}
