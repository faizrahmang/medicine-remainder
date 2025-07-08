const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchReminders = async () => {
  const response = await fetch(`${API_URL}/reminders`);
  if (!response.ok) {
    throw new Error('Failed to fetch reminders');
  }
  return response.json();
};

export const addReminder = async (reminderData) => {
  const response = await fetch(`${API_URL}/reminders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reminderData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add reminder');
  }
  
  return response.json();
};

export const updateReminder = async (id, updateData) => {
  const response = await fetch(`${API_URL}/reminders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update reminder');
  }
  
  return response.json();
};

export const deleteReminder = async (id) => {
  const response = await fetch(`${API_URL}/reminders/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete reminder');
  }
  
  return response.json();
};