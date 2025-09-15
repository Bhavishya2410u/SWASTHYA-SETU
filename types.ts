export interface DiagnosisSuggestion {
  id: number;
  term: string;
  namasteCode: string;
  icd11Code: string;
  confidence: number;
  note?: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  id: string;
}

export interface DiagnosisHistoryEntry extends DiagnosisSuggestion {
  timestamp: string;
}
