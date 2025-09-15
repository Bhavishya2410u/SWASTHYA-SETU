import React, { useState } from 'react';
import type { DiagnosisHistoryEntry, PatientInfo } from '../types';

interface FhirBundleDisplayProps {
  history: DiagnosisHistoryEntry[];
  patient: PatientInfo | null;
}

const FhirBundleDisplay: React.FC<FhirBundleDisplayProps> = ({ history, patient }) => {
  const [bundleJson, setBundleJson] = useState<string | null>(null);

  const generateSessionBundle = () => {
    if (!patient || history.length === 0) {
      setBundleJson(null);
      alert("No patient session active or no diagnoses recorded yet.");
      return;
    }

    const birthDate = new Date(new Date().setFullYear(new Date().getFullYear() - patient.age)).toISOString().split('T')[0];

    const patientEntry = {
      "fullUrl": `urn:uuid:${patient.id}`,
      "resource": {
        "resourceType": "Patient",
        "id": patient.id,
        "name": [{ "text": patient.name }],
        "birthDate": birthDate
      }
    };

    const conditionEntries = history.map((entry, index) => ({
      "fullUrl": `urn:uuid:condition-${patient.id}-${index}`,
      "resource": {
        "resourceType": "Condition",
        "id": `condition-${patient.id}-${index}`,
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
              "code": "active",
              "display": "Active"
            }
          ]
        },
        "verificationStatus": {
           "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              "code": "confirmed",
              "display": "Confirmed"
            }
          ]
        },
        "subject": {
          "reference": `Patient/${patient.id}`,
          "display": patient.name
        },
        "recordedDate": new Date(entry.timestamp).toISOString(),
        "code": {
          "text": entry.term,
          "coding": [
            {
              "system": "http://sih.gov.in/fhir/CodeSystem/NAMASTE",
              "code": entry.namasteCode,
              "display": entry.term
            },
            {
              "system": "http://id.who.int/icd/release/11/mms",
              "code": entry.icd11Code,
              "display": entry.term
            }
          ]
        }
      }
    }));

    const fullBundle = {
      "resourceType": "Bundle",
      "id": `session-bundle-${patient.id}-${new Date().getTime()}`,
      "type": "collection",
      "timestamp": new Date().toISOString(),
      "entry": [patientEntry, ...conditionEntries]
    };

    setBundleJson(JSON.stringify(fullBundle, null, 2));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-sih-dark-gray">Session Diagnosis Bundle</h2>
        <button
          onClick={generateSessionBundle}
          disabled={!patient || history.length === 0}
          className="bg-sih-orange text-white font-bold py-2 px-4 rounded-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sih-orange transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          aria-label="Generate FHIR Bundle for the entire session"
        >
          Generate Bundle
        </button>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-inner h-96 overflow-auto">
        <pre>
          <code className="text-sm">
            {bundleJson ? bundleJson : <span className="text-gray-400">// Click 'Generate Bundle' to see the complete session summary...</span>}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default FhirBundleDisplay;