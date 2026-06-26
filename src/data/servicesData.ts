import { ServiceInfo } from '../types';

export const servicesData: ServiceInfo[] = [
  {
    id: 'aics',
    name: 'AICS Program',
    fullName: 'Assistance to Individuals in Crisis Situations',
    description: 'A social safety net program that provides immediate medical, burial, educational, food, transportation, or financial assistance to individuals and families in extremely difficult or crisis situations.',
    eligibility: [
      'Individuals or families experiencing sudden loss of livelihood or income due to disasters, illness, or death of a family breadwinner.',
      'Indigent patients seeking support for medical bills, chemotherapy, dialysis, or buying expensive prescribed medications.',
      'Students from low-income households struggling to pay enrollment fees, purchase books, or meet educational expenses.',
      'Families needing support for funeral, burial, or casket expenses of a deceased relative.',
      'Stranded individuals needing immediate transportation assistance to return to their home provinces.'
    ],
    requirements: [
      'Barangay Certificate of Indigency (Purpose: MSWDO Assistance)',
      'Valid Government-issued ID of the applicant (original and photocopy)',
      'Clinical Abstract or Medical Certificate (For Medical Assistance)',
      'Prescription or hospital billing statement (For Medical Assistance)',
      'Death Certificate and Funeral Contract (For Funeral/Burial Assistance)',
      'Certificate of Enrollment or School assessment form (For Educational Assistance)',
      'Social Case Study Report (Issued by the local municipal social worker, if applicable)'
    ],
    iconName: 'Activity'
  },
  {
    id: 'pwd',
    name: 'PWD Services',
    fullName: 'Persons with Disability Welfare & ID Registration',
    description: 'Provides welfare assistance, capacity-building, and coordinates the issuance of the Philippine PWD ID Card, granting a 20% discount and VAT exemption on medicine, medical and dental services, transport, hotels, and restaurants.',
    eligibility: [
      'Any Filipino citizen with a permanent physical, mental, intellectual, or sensory impairment.',
      'Must be a bona fide resident of the municipality.',
      'Includes orthopedic, visual, hearing, speech, intellectual, psychosocial, or learning disabilities, and chronic illnesses.'
    ],
    requirements: [
      'Completed PWD Registration Form (available at MSWDO)',
      'Medical Certificate from a licensed physician stating the specific type of disability',
      'Two (2) recent 1x1 ID pictures with white background',
      'Barangay Certificate of Residency',
      'Valid Government-issued ID or Birth Certificate'
    ],
    iconName: 'HeartHandshake'
  },
  {
    id: 'senior',
    name: 'Senior Citizens',
    fullName: 'Elderly Welfare Services & OSCA Registration',
    description: 'Promotes the welfare of senior citizens through the Office of the Senior Citizens Affairs (OSCA). Coordinates the issuance of Senior Citizen IDs, booklet access, quarterly social pension for indigent seniors, and community wellness programs.',
    eligibility: [
      'Any Filipino citizen who is a resident of the municipality.',
      'Must be at least sixty (60) years of age.',
      'For Social Pension: Must be frail, sickly, or with a disability, without a regular source of income/pension, and without financial support from relatives.'
    ],
    requirements: [
      'Completed Senior Citizen Application Form',
      'Birth Certificate or any official document proving age (60+ years old)',
      'Barangay Certificate of Residency (minimum of 6 months residency)',
      'Two (2) recent 1x1 ID pictures with white background',
      'Valid ID showing address in the municipality'
    ],
    iconName: 'Users'
  },
  {
    id: 'solo-parent',
    name: 'Solo Parents',
    fullName: 'Solo Parents Welfare Services & ID Issuance',
    description: 'Provides benefits and privileges to solo parents, including comprehensive social services, counseling, livelihood assistance, a 7-day parental leave, and flexible work schedules under the Solo Parents Welfare Act (RA 8972).',
    eligibility: [
      'A parent left alone with the responsibility of parenthood due to death of spouse, physical or mental incapacity of spouse, or legal separation.',
      'An unmarried mother/father who kept and is rearing their child/children.',
      'Any individual who provides sole parental care and support to a child (e.g. foster parent, guardian).',
      'Low-income solo parents under the poverty threshold.'
    ],
    requirements: [
      'Barangay Certificate stating solo parent status for at least 6 months',
      'Birth Certificate(s) of child/children (below 18 years old, or older if disabled/dependent)',
      'Income Tax Return (ITR) or Certificate of Tax Exemption from BIR',
      'Death Certificate of spouse (if widowed) or Legal Court Decision (if separated)',
      'Two (2) recent 1x1 ID pictures of the applicant'
    ],
    iconName: 'Award'
  }
];
