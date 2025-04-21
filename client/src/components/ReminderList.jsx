// client/src/components/ReminderList.js
import React from 'react';

function ReminderList({ reminders, currentTime, onToggleTaken, onDeleteReminder }) {
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };
  
  // Sort reminders by time
  const sortedReminders = [...reminders].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-center justify-center h-64">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-gray-500 text-lg">No medicine reminders yet</p>
        <p className="text-gray-400 text-sm">Add your first medicine above</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-indigo-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Your Medicines ({reminders.length})
      </h2>
      
      <div className="space-y-4">
        {sortedReminders.map(reminder => {
          // Determine if this reminder is due now (current time matches)
          const isCurrentlyDue = reminder.time === currentTime && !reminder.taken;
          
          return (
            <div 
              key={reminder._id} 
              className={`rounded-lg shadow-md transition-all duration-200 overflow-hidden ${
                isCurrentlyDue ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Status indicator */}
                <div className={`w-full md:w-2 ${
                  reminder.taken ? 'bg-green-500' : isCurrentlyDue ? 'bg-red-500' : 'bg-amber-400'
                }`}></div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Medicine info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="font-bold text-lg text-gray-800">{reminder.medicineName}</h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        reminder.taken 
                          ? 'bg-green-100 text-green-800' 
                          : isCurrentlyDue 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {reminder.taken ? 'Taken' : isCurrentlyDue ? 'Due Now!' : 'Pending'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(reminder.time)}
                    </p>
                    
                    {reminder.notes && (
                      <p className="text-gray-500 text-sm mt-1 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {reminder.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 self-end md:self-center">
                    <button
                      onClick={() => onToggleTaken(reminder._id, reminder.taken)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        reminder.taken 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400' 
                          : 'bg-green-100 hover:bg-green-200 text-green-800 focus:ring-green-500'
                      }`}
                    >
                      {reminder.taken 
                        ? (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Undo
                          </span>
                        ) 
                        : (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Taken
                          </span>
                        )
                      }
                    </button>
                    
                    <button
                      onClick={() => onDeleteReminder(reminder._id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReminderList;