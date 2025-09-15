import React from 'react';
import type { DiagnosisSuggestion, PatientInfo } from '../types';

interface FhirCodeDisplayProps {
  diagnosis: DiagnosisSuggestion | null;
  patient: PatientInfo | null;
}

const FhirCodeDisplay: React.FC<FhirCodeDisplayProps> = ({ diagnosis, patient }) => {
  const generateFhirBundle = (d: DiagnosisSuggestion, p: PatientInfo) => {
    const patientResourceId = `Patient/${p.id}`;
    // Estimate birthDate from age for demonstration purposes
    const birthDate = new Date(new Date().setFullYear(new Date().getFullYear() - p.age)).toISOString().split('T')[0];

    return {
      "resourceType": "Bundle",
      "id": `bundle-${p.id}-${d.id}`,
      "type": "collection",
      "timestamp": new Date().toISOString(),
      "entry": [
        {
          "fullUrl": `urn:uuid:${p.id}`,
          "resource": {
            "resourceType": "Patient",
            "id": p.id,
            "name": [{ "text": p.name }],
            "birthDate": birthDate
          }
        },
        {
          "fullUrl": `urn:uuid:conceptmap-${d.id}`,
          "resource": {
            "resourceType": "ConceptMap",
            "id": `namaste-icd11-${d.namasteCode.toLowerCase()}`,
            "url": `http://sih.gov.in/fhir/ConceptMap/namaste-icd11-${d.namasteCode.toLowerCase()}`,
            "version": "1.0.0",
            "name": "NamasteToICD11Mapping",
            "title": `Mapping from NAMASTE (${d.namasteCode}) to ICD-11 (${d.icd11Code})`,
            "status": "active",
            "experimental": true,
            "description": `Dual-coding map for the clinical term '${d.term}' for patient ${p.name}. AI Confidence: ${d.confidence}%.`,
            "sourceUri": "http://sih.gov.in/fhir/CodeSystem/NAMASTE",
            "targetUri": "http://id.who.int/icd/release/11/mms",
            "group": [
              {
                "source": "http://sih.gov.in/fhir/CodeSystem/NAMASTE",
                "target": "http://id.who.int/icd/release/11/mms",
                "element": [
                  {
                    "code": d.namasteCode,
                    "display": d.term,
                    "target": [
                      {
                        "code": d.icd11Code,
                        "display": d.term,
                        "equivalence": "equivalent"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    };
  };

  const fhirJson = (diagnosis && patient) ? JSON.stringify(generateFhirBundle(diagnosis, patient), null, 2) : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-sih-dark-gray mb-4">FHIR Resource for Selected Diagnosis</h2>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-inner h-96 overflow-auto">
        <pre>
          <code className="text-sm">
            {fhirJson ? fhirJson : <span className="text-gray-400">// Select a diagnosis to see the patient-specific FHIR Bundle...</span>}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default FhirCodeDisplay;