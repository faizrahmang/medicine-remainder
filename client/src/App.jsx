// client/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ReminderForm from './components/ReminderForm';
import ReminderList from './components/ReminderList';
import { fetchReminders, addReminder, updateReminder, deleteReminder } from './api';
// Import alarm sound
import alarmSound from './assets/alarm.mp3';

function App() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [activeAlarms, setActiveAlarms] = useState([]);
  const audioRef = useRef(null);
  
  // Function to get formatted current time in HH:MM format
  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Effect to update current time every second
  useEffect(() => {
    // Set initial time
    setCurrentTime(getCurrentTimeString());
    
    // Update time every second
    const timeIntervalId = setInterval(() => {
      const newTime = getCurrentTimeString();
      setCurrentTime(newTime);
    }, 1000); // Update every second
    
    return () => clearInterval(timeIntervalId);
  }, []);
  
  // Effect to load reminders and set up notification permission
  useEffect(() => {
    // Load reminders on component mount
    loadReminders();
    
    // Request notification permission on start
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  // Effect to check for due reminders whenever the current time or reminders list changes
  useEffect(() => {
    checkReminders();
  }, [currentTime, reminders]);
  
  // Effect to play alarm sound when activeAlarms changes
  useEffect(() => {
    if (activeAlarms.length > 0 && audioRef.current) {
      // Try to play the sound
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Could not play the alarm sound:", error);
        });
      }
    } else if (activeAlarms.length === 0 && audioRef.current) {
      // Stop the sound if no active alarms
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeAlarms]);
  
  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await fetchReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reminders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddReminder = async (reminderData) => {
    try {
      await addReminder(reminderData);
      await loadReminders(); // Reload reminders after adding
    } catch (err) {
      setError('Failed to add reminder');
      console.error(err);
    }
  };
  
  const handleToggleTaken = async (id, currentStatus) => {
    try {
      await updateReminder(id, { taken: !currentStatus });
      await loadReminders(); // Reload reminders after updating
      
      // If marking as taken, remove from active alarms
      if (!currentStatus) {
        setActiveAlarms(prevAlarms => prevAlarms.filter(alarmId => alarmId !== id));
      }
    } catch (err) {
      setError('Failed to update reminder');
      console.error(err);
    }
  };
  
  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id);
      await loadReminders(); // Reload reminders after deleting
      
      // Remove from active alarms if deleted
      setActiveAlarms(prevAlarms => prevAlarms.filter(alarmId => alarmId !== id));
    } catch (err) {
      setError('Failed to delete reminder');
      console.error(err);
    }
  };
  
  const stopAllAlarms = () => {
    setActiveAlarms([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  const checkReminders = () => {
    // Check if any reminders match the current time
    const dueReminders = reminders.filter(reminder => {
      return reminder.time === currentTime && !reminder.taken;
    });
    
    // If new due reminders are found, update active alarms and send notifications
    dueReminders.forEach(reminder => {
      if (!activeAlarms.includes(reminder._id)) {
        // Add to active alarms
        setActiveAlarms(prevAlarms => [...prevAlarms, reminder._id]);
        
        // Create browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification('Medicine Reminder', {
            body: `Time to take ${reminder.medicineName}${reminder.notes ? ` - ${reminder.notes}` : ''}`,
            icon: '/pill-icon.png', // Make sure this exists in your public folder
            requireInteraction: true // Keep notification until user interacts with it
          });
          
          // Close notification and stop this specific alarm when notification is clicked
          notification.onclick = () => {
            notification.close();
            window.focus();
            setActiveAlarms(prevAlarms => prevAlarms.filter(id => id !== reminder._id));
          };
        }
      }
    });
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800 pt-4">Medicine Reminder</h1>
        
        {/* Current time display */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-md">
            <span className="text-gray-500 mr-2">Current Time:</span>
            <span className="font-semibold text-indigo-700">{currentTime}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ReminderForm onAddReminder={handleAddReminder} />
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <ReminderList 
                reminders={reminders}
                currentTime={currentTime}
                onToggleTaken={handleToggleTaken}
                onDeleteReminder={handleDeleteReminder}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for alarm */}
      <audio ref={audioRef} src={alarmSound} loop />
      
      {/* Floating button to stop all alarms */}
      {activeAlarms.length > 0 && (
        <button 
          onClick={stopAllAlarms}
          className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Stop Alarms ({activeAlarms.length})
        </button>
      )}
    </div>
  );
}

export default App;