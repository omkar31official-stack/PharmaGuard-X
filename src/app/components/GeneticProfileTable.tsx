import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { PharmacogenomicProfile } from '../types/pharma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface GeneticProfileTableProps {
  profile: PharmacogenomicProfile;
}

export function GeneticProfileTable({ profile }: GeneticProfileTableProps) {
  const phenotypeColors: Record<string, string> = {
    'PM': 'bg-red-100 text-red-800',
    'IM': 'bg-yellow-100 text-yellow-800',
    'NM': 'bg-green-100 text-green-800',
    'RM': 'bg-blue-100 text-blue-800',
    'URM': 'bg-purple-100 text-purple-800',
    'Unknown': 'bg-gray-100 text-gray-800'
  };
  
  const phenotypeLabels: Record<string, string> = {
    'PM': 'Poor Metabolizer',
    'IM': 'Intermediate Metabolizer',
    'NM': 'Normal Metabolizer',
    'RM': 'Rapid Metabolizer',
    'URM': 'Ultrarapid Metabolizer',
    'Unknown': 'Unknown'
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Genetic Profile</h3>
      
      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="text-sm text-gray-600">Primary Gene</span>
          <p className="text-lg font-mono font-semibold text-gray-900">{profile.primary_gene}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Diplotype</span>
          <p className="text-lg font-mono font-semibold text-gray-900">{profile.diplotype}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Phenotype</span>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={phenotypeColors[profile.phenotype]}>
              {profile.phenotype}
            </Badge>
            <span className="text-sm text-gray-700">
              {phenotypeLabels[profile.phenotype]}
            </span>
          </div>
        </div>
      </div>
      
      {/* Detected Variants Table */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detected Variants</h4>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">RS ID</TableHead>
                <TableHead className="font-semibold">Gene</TableHead>
                <TableHead className="font-semibold">Allele</TableHead>
                <TableHead className="font-semibold">Genotype</TableHead>
                <TableHead className="font-semibold">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.detected_variants.length > 0 ? (
                profile.detected_variants.map((variant, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{variant.rsid}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{variant.gene}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{variant.allele}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{variant.genotype}</TableCell>
                    <TableCell className="text-sm">{variant.impact}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                    No specific variants detected for {profile.primary_gene}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
