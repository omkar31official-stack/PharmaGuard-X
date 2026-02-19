/**
 * Generates a sample VCF file for testing purposes
 */
export function generateSampleVCF(): string {
  return `##fileformat=VCFv4.2
##fileDate=20260219
##source=PharmaGuardX_TestData
##reference=GRCh38
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read Depth">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE1
chr22	42126611	rs3892097	G	A	100	PASS	DP=50;AF=0.5	GT:DP	0/1:50
chr10	96541616	rs4244285	G	A	100	PASS	DP=45;AF=0.5	GT:DP	0/1:45
chr10	96522463	rs4986893	G	A	100	PASS	DP=48;AF=0	GT:DP	0/0:48
chr10	96702047	rs12248560	C	T	100	PASS	DP=52;AF=1.0	GT:DP	1/1:52
chr10	96709039	rs1799853	C	T	100	PASS	DP=47;AF=0.5	GT:DP	0/1:47
chr10	96741053	rs1057910	A	C	100	PASS	DP=49;AF=0	GT:DP	0/0:49
chr12	21331549	rs4149056	T	C	100	PASS	DP=51;AF=0.5	GT:DP	0/1:51
chr12	21331037	rs2306283	A	G	100	PASS	DP=46;AF=0	GT:DP	0/0:46
chr6	18130918	rs1800462	C	G	100	PASS	DP=50;AF=0	GT:DP	0/0:50
chr6	18139228	rs1800460	G	A	100	PASS	DP=48;AF=0	GT:DP	0/0:48
chr6	18143715	rs1142345	T	C	100	PASS	DP=49;AF=0.5	GT:DP	0/1:49
chr1	97915614	rs3918290	C	T	100	PASS	DP=47;AF=0	GT:DP	0/0:47
chr1	97883329	rs55886062	T	G	100	PASS	DP=45;AF=0	GT:DP	0/0:45
chr1	97981395	rs67376798	A	T	100	PASS	DP=50;AF=0	GT:DP	0/0:50
chr16	31096368	rs9923231	C	T	100	PASS	DP=52;AF=0.5	GT:DP	0/1:52
chr22	42127803	rs1065852	C	T	100	PASS	DP=48;AF=0	GT:DP	0/0:48
chr22	42130692	rs28371725	C	T	100	PASS	DP=46;AF=0	GT:DP	0/0:46
chr22	42126938	rs5030655	G	DEL	100	PASS	DP=49;AF=0	GT:DP	0/0:49
`;
}

/**
 * Downloads the sample VCF file
 */
export function downloadSampleVCF() {
  const vcfContent = generateSampleVCF();
  const blob = new Blob([vcfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-pharmacogenomic.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
