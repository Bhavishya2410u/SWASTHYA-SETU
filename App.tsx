import React, { useState, useEffect } from 'react';
import PatientRecord from './components/PatientRecord';
import DiagnosisSearch from './components/DiagnosisSearch';
import FhirCodeDisplay from './components/FhirCodeDisplay';
import PatientForm from './components/PatientForm';
import { MOCK_DIAGNOSES } from './constants';
import type { PatientInfo, DiagnosisSuggestion, DiagnosisHistoryEntry } from './types';
import FhirBundleDisplay from './components/FhirBundleDisplay';

const App: React.FC = () => {
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<DiagnosisSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<DiagnosisSuggestion | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryEntry[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = MOCK_DIAGNOSES.filter(d =>
      d.term.toLowerCase().includes(lowercasedTerm) ||
      d.namasteCode.toLowerCase().includes(lowercasedTerm) ||
      d.icd11Code.toLowerCase().includes(lowercasedTerm)
    );
    setSuggestions(filtered);
  }, [searchTerm]);

  const handleSetPatient = (patientData: PatientInfo) => {
    setPatient(patientData);
    setDiagnosisHistory([]);
  };

  const handleClearPatient = () => {
    setPatient(null);
    setDiagnosisHistory([]);
    setSearchTerm('');
    setSelectedSuggestion(null);
    setSuggestions([]);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setSelectedSuggestion(null);
  };

  const handleSuggestionSelect = (suggestion: DiagnosisSuggestion) => {
    setSearchTerm(suggestion.term);
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
  };

  const handleSaveDiagnosis = () => {
    if (selectedSuggestion) {
      const newHistoryEntry: DiagnosisHistoryEntry = {
        ...selectedSuggestion,
        timestamp: new Date().toISOString() // Use ISO string for reliability
      };
      setDiagnosisHistory(prevHistory => [newHistoryEntry, ...prevHistory]);
      
      setSearchTerm('');
      setSelectedSuggestion(null);
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen text-sih-dark-gray p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sih-blue">SWASTHYA SETU</h1>
        <p className="text-lg text-sih-medium-gray mt-2">Smart India Hackathon Prototype: EMR Dual-Coding Integration</p>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          {patient ? (
            <PatientRecord patient={patient} history={diagnosisHistory} onClearPatient={handleClearPatient} />
          ) : (
            <PatientForm onSetPatient={handleSetPatient} />
          )}
        </div>
        <div className="lg:col-span-1 relative">
          <div className={`transition-opacity duration-300 space-y-8 ${!patient ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div>
              <DiagnosisSearch 
                searchTerm={searchTerm}
                suggestions={suggestions}
                selectedSuggestion={selectedSuggestion}
                onSearchChange={handleSearchChange}
                onSuggestionSelect={handleSuggestionSelect}
                onSave={handleSaveDiagnosis}
              />
            </div>
            <FhirCodeDisplay diagnosis={selectedSuggestion} patient={patient} />
            <FhirBundleDisplay history={diagnosisHistory} patient={patient} />
          </div>
          {!patient && (
            <div className="absolute inset-0 bg-sih-light-gray/60 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 p-4" aria-hidden="true">
              <div className="text-center p-6 bg-white rounded-lg shadow-xl border">
                 <svg className="mx-auto h-12 w-12 text-sih-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <h3 className="text-xl font-bold text-sih-dark-gray mt-2">Patient Session Required</h3>
                <p className="text-sih-medium-gray mt-1">Please enter patient details on the left to begin.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center mt-12 py-4 border-t">
        <p className="text-sm text-gray-500">&copy; 2024 Team Tech Titans for Smart India Hackathon. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;