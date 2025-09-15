import React from 'react';
import type { DiagnosisSuggestion } from '../types';

interface DiagnosisSearchProps {
  searchTerm: string;
  suggestions: DiagnosisSuggestion[];
  selectedSuggestion: DiagnosisSuggestion | null;
  onSearchChange: (term: string) => void;
  onSuggestionSelect: (suggestion: DiagnosisSuggestion) => void;
  onSave: () => void;
}

const DiagnosisSearch: React.FC<DiagnosisSearchProps> = ({
  searchTerm,
  suggestions,
  selectedSuggestion,
  onSearchChange,
  onSuggestionSelect,
  onSave,
}) => {
  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-sih-dark-gray mb-4">AI-Powered Diagnosis Input</h2>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Enter clinical term or diagnosis..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sih-blue focus:border-sih-blue transition-all"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          <ul>
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => onSuggestionSelect(s)}
                className="px-4 py-3 cursor-pointer hover:bg-sih-light-gray transition-colors duration-200 border-b last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sih-dark-gray">{s.term}</p>
                    <p className="text-sm text-sih-medium-gray">
                      <span className="font-medium text-sih-dark-gray">NAMASTE Code:</span> {s.namasteCode} | <span className="font-medium text-sih-dark-gray">ICD-11 Code:</span> {s.icd11Code}
                    </p>
                    {s.note && <p className="text-xs text-gray-500 italic mt-1">{s.note}</p>}
                  </div>
                  <span className="text-white bg-sih-orange text-xs font-bold px-2 py-1 rounded-full">{s.confidence}% match</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedSuggestion && (
        <div className="mt-6 p-4 bg-blue-50 border border-sih-blue rounded-lg text-center">
            <p className="font-semibold mb-3">Selected: {selectedSuggestion.term}</p>
            <button
                onClick={onSave}
                className="w-full bg-sih-blue text-white font-bold py-3 px-6 rounded-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sih-blue transition-transform transform hover:scale-105 active:scale-100"
            >
                Select and Add Dual Codes to Record
            </button>
        </div>
      )}
    </div>
  );
};

export default DiagnosisSearch;