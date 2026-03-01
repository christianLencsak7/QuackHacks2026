import React, { useState, useEffect } from 'react';
import AuthPage from './features/auth/AuthPage';
import Sidebar from './features/navigation/Sidebar';
import CaptureView from './features/capture/CaptureView';
import ScheduleView from './features/schedule/ScheduleView';
import EventVerificationView from './features/verification/EventVerificationView';
import EventListView from './features/schedule/EventListView';
import { get, del } from 'idb-keyval';

// Initial Mock Events Lifted from ScheduleView
const INITIAL_EVENTS = [
  { id: 1, title: 'Q3 Planning Review', time: '14:00', type: 'meeting', date: 15 },
  { id: 4, title: 'Team Sync', time: '10:00', type: 'meeting', date: 15 },
  { id: 2, title: 'Dentist Appointment', time: '09:00', type: 'personal', date: 18 },
  { id: 3, title: 'Flight NY to SF', time: '18:45', type: 'travel', date: 25 },
  { id: 5, title: 'Product Launch', time: '08:00', type: 'milestone', date: 5 },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('capture');
  const [pendingEventData, setPendingEventData] = useState(null);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [sharedFile, setSharedFile] = useState(null);

  // On login, check if a file was shared via the Web Share Target
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSharedImage = async () => {
      try {
        const file = await get('shared-image');
        if (file) {
          await del('shared-image');
          setSharedFile(file);
          setCurrentView('capture');
        }
      } catch (err) {
        console.error('Error checking IndexedDB for shared image:', err);
      }
    };

    checkSharedImage();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleExtractionComplete = (data) => {
    setSharedFile(null);
    setPendingEventData(data);
    setCurrentView('verification');
  };

  const handleApproveEvent = (finalData) => {
    // Convert YYYY-MM-DD into a simple day integer for the mock calendar
    let parsedDay = 15; // default to today in our mock
    if (finalData.startDate) {
      const parts = finalData.startDate.split('-');
      if (parts.length === 3) parsedDay = parseInt(parts[2], 10);
    }

    const newEvent = {
      id: Date.now(),
      title: finalData.title || 'Untitled Event',
      time: finalData.startTime || '12:00',
      type: finalData.typeTags?.length > 0 ? finalData.typeTags[0] : 'other',
      date: parsedDay,
      fullData: finalData
    };

    setEvents(prev => [...prev, newEvent]);
    setPendingEventData(null);
    setCurrentView('schedule');
  };

  const handleCancelVerification = () => {
    setPendingEventData(null);
    setCurrentView('capture');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={() => setIsAuthenticated(false)}
      />
      <main className="flex-1 relative h-full flex flex-col min-w-0 pb-16 md:pb-0">
        <div className="absolute inset-0 pointer-events-none border-l border-slate-200" />
        {currentView === 'capture' && (
          <CaptureView
            onExtractionComplete={handleExtractionComplete}
            sharedFile={sharedFile}
          />
        )}
        {currentView === 'verification' && (
          <EventVerificationView
            initialData={pendingEventData}
            onApprove={handleApproveEvent}
            onCancel={handleCancelVerification}
          />
        )}
        {currentView === 'schedule' && <ScheduleView events={events} />}
        {currentView === 'list' && <EventListView events={events} />}
      </main>
    </div>
  );
}

export default App;
