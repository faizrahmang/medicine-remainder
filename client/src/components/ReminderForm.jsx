// client/src/components/ReminderForm.js
import React, { useState } from 'react';

function ReminderForm({ onAddReminder }) {
  const [formData, setFormData] = useState({
    medicineName: '',
    time: '',
    notes: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReminder(formData);
    setFormData({ medicineName: '', time: '', notes: '' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-indigo-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Add New Medicine
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="medicineName">
            Medicine Name
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            id="medicineName"
            name="medicineName"
            type="text"
            placeholder="E.g. Aspirin, Vitamin D"
            value={formData.medicineName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="time">
            Time
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
            Notes / Dosage
          </label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            id="notes"
            name="notes"
            placeholder="E.g. 2 tablets with food"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <button
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
          type="submit"
        >
          Add Reminder
        </button>
      </form>
    </div>
  );
}

export default ReminderForm;