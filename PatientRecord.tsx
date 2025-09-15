import React from 'react';
import type { PatientInfo, DiagnosisHistoryEntry } from '../types';

interface PatientRecordProps {
  patient: PatientInfo;
  history: DiagnosisHistoryEntry[];
  onClearPatient: () => void;
}

const PatientRecord: React.FC<PatientRecordProps> = ({ patient, history, onClearPatient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-2xl font-bold text-sih-dark-gray">Patient Record</h2>
        <button
          onClick={onClearPatient}
          className="bg-red-500 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all text-sm"
          aria-label="End patient session"
        >
          End Session
        </button>
      </div>
      <div className="mb-6">
        <p><span className="font-semibold">Name:</span> {patient.name}</p>
        <p><span className="font-semibold">Age:</span> {patient.age}</p>
        <p><span className="font-semibold">Patient ID:</span> {patient.id}</p>
      </div>
      <h3 className="text-xl font-bold text-sih-dark-gray mb-3">Diagnosis History</h3>
      <div className="space-y-3 flex-grow overflow-y-auto pr-2">
        {history.length === 0 ? (
          <p className="text-sih-medium-gray italic">No diagnoses recorded for this session yet.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id + entry.timestamp} className="bg-blue-50 p-3 rounded-md border border-blue-100 transition-all hover:shadow-sm">
              <p className="font-semibold text-sih-blue">{entry.term}</p>
              <div className="text-sm text-sih-dark-gray mt-1">
                <p><span className="font-medium">NAMASTE Code:</span> {entry.namasteCode}</p>
                <p><span className="font-medium">ICD-11 Code:</span> {entry.icd11Code}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">{new Date(entry.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientRecord;