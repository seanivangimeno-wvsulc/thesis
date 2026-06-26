export interface ServiceInfo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  eligibility: string[];
  requirements: string[];
  iconName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
}

export interface HouseholdMember {
  name: string;
  age: number;
  relationship: string;
  occupation: string;
  monthlyIncome: number;
}

export interface UploadedRequirement {
  id: string;
  requirementName: string; // e.g. "Certificate of Indigency"
  fileName: string;
  fileSize: string;
  fileType: string;
  fileData: string; // Base64 url
  uploadedAt: string;
}

export type AssistanceType = 'Medical' | 'Funeral' | 'Food' | 'Transportation' | 'Educational' | 'Financial';

export interface AICSApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  assistanceType: AssistanceType;
  justification: string;
  householdMembers: HouseholdMember[];
  documents: UploadedRequirement[];
  status: 'Pending Review' | 'Document Verification' | 'Interview Scheduled' | 'Approved' | 'Completed' | 'Rejected';
  statusNotes?: string;
  submissionDate: string;
  controlNumber: string;
}
