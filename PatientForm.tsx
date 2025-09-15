import React, { useState } from 'react';
import type { PatientInfo } from '../types';

interface PatientFormProps {
  onSetPatient: (patient: PatientInfo) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSetPatient }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age && id.trim()) {
      onSetPatient({
        name: name.trim(),
        age: parseInt(age, 10),
        id: id.trim(),
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold text-sih-dark-gray mb-4 border-b pb-2">Start New Patient Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="patient-form-heading">
        <div>
          <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="patient-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sih-blue focus:border-sih-blue"
            placeholder="e.g., Arjun Sharma"
          />
        </div>
        <div>
          <label htmlFor="patient-age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="patient-age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="0"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sih-blue focus:border-sih-blue"
            placeholder="e.g., 45"
          />
        </div>
        <div>
          <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            id="patient-id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sih-blue focus:border-sih-blue"
            placeholder="e.g., PID-2024-001"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-sih-orange text-white font-bold py-3 px-6 rounded-lg hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sih-orange transition-transform transform hover:scale-105 active:scale-100 disabled:bg-gray-400 disabled:scale-100 disabled:hover:bg-gray-400"
          disabled={!name.trim() || !age || !id.trim()}
        >
          Start Diagnosis Session
        </button>
      </form>
    </div>
  );
};

export default PatientForm;