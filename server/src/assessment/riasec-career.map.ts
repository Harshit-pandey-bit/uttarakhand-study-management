// server/src/assessment/riasec-career.map.ts
//
// Static RIASEC career mapper for rural Uttarakhand students.
// Maps each Holland dimension to relevant, aspirational careers.

export type HollandDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export const DIMENSION_LABELS: Record<HollandDimension, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

/**
 * Careers mapped to each Holland dimension, curated for
 * rural Indian students with government school backgrounds.
 */
export const RIASEC_CAREERS: Record<HollandDimension, string[]> = {
  R: [
    'Agricultural Scientist',
    'Civil Engineer',
    'Forest Ranger',
    'Mechanical Engineer',
    'Veterinarian',
  ],
  I: [
    'Software Engineer',
    'Data Scientist',
    'Research Scientist',
    'Doctor (MBBS)',
    'Environmental Scientist',
  ],
  A: [
    'Graphic Designer',
    'Content Creator',
    'Architect',
    'Journalist',
    'Fashion Designer',
  ],
  S: [
    'School Teacher',
    'Social Worker',
    'Nurse / Healthcare Worker',
    'Counsellor',
    'NGO Program Manager',
  ],
  E: [
    'Entrepreneur',
    'Bank Manager',
    'Sales & Marketing Manager',
    'Government Administrator (IAS/PCS)',
    'Tourism Manager',
  ],
  C: [
    'Chartered Accountant',
    'Bank Clerk / PO',
    'Data Entry Operator',
    'Government Record Keeper',
    'Logistics Coordinator',
  ],
};

/**
 * Given an array of top dimension codes (e.g. ['I','S','E']),
 * returns a deduplicated list of matching careers.
 */
export function getCareersForCode(topDimensions: HollandDimension[]): string[] {
  const careers = new Set<string>();
  for (const dim of topDimensions) {
    for (const career of RIASEC_CAREERS[dim] ?? []) {
      careers.add(career);
    }
  }
  return Array.from(careers);
}
