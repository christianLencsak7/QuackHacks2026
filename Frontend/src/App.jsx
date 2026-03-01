import React, { useState, useEffect } from 'react';
import AuthPage from './features/auth/AuthPage';
import Sidebar from './features/navigation/Sidebar';
import CaptureView from './features/capture/CaptureView';
import ScheduleView from './features/schedule/ScheduleView';
import EventVerificationView from './features/verification/EventVerificationView';
import EventListView from './features/schedule/EventListView';

// Read and delete the shared image from native IndexedDB (written by sw.js)
function getAndClearSharedImage() {
  console.log('[App] Checking IndexedDB for shared image...');
  return new Promise((resolve) => {
    const req = indexedDB.open('instaparse-share', 1);
    req.onupgradeneeded = (e) => {
      console.log('[App] IndexedDB upgrade — creating images store');
      e.target.result.createObjectStore('images');
    };
    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('images', 'readwrite');
      const store = tx.objectStore('images');
      const getReq = store.get('shared-image');
      getReq.onsuccess = () => {
        const file = getReq.result;
        if (file) {
          console.log('[App] ✅ Found shared image in IndexedDB:', file.name, file.type, file.size + 'b');
          store.delete('shared-image');
        } else {
          console.log('[App] No shared image found in IndexedDB');
        }
        resolve(file || null);
      };
      getReq.onerror = () => {
        console.error('[App] IndexedDB get error:', getReq.error);
        resolve(null);
      };
    };
    req.onerror = () => {
      console.error('[App] IndexedDB open error:', req.error);
      resolve(null);
    };
  });
}



function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
  const [currentView, setCurrentView] = useState('capture');
  const [pendingEventData, setPendingEventData] = useState(null);
  const [events, setEvents] = useState([]);
  const [sharedFile, setSharedFile] = useState(null);

  // On login, check if a file was shared via the Web Share Target
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSharedImage = async () => {
      try {
        const file = await getAndClearSharedImage();
        if (file) {
          setSharedFile(file);
          setCurrentView('capture');
        }
      } catch (err) {
        console.error('Error checking IndexedDB for shared image:', err);
      }
    };

    checkSharedImage();
  }, [isAuthenticated]);

  // Fetch Events when user logs in
  useEffect(() => {
    if (!user) return;
    fetch(`/api/events?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEvents(data);
      })
      .catch(console.error);
  }, [user]);

  if (!isAuthenticated) {
    return <AuthPage onLogin={setUser} />;
  }

  const handleExtractionComplete = (data) => {
    setSharedFile(null);
    setPendingEventData(data);
    setCurrentView('verification');
  };

  const handleApproveEvent = async (finalData) => {
    try {
      const res = await fetch('/api/create_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      const data = await res.json();

      if (data.event) {
        // Map the newly returned DB event back to the frontend's expected shape
        const newEvent = {
          id: data.event.id,
          title: data.event.title,
          time: data.event.start_time,
          type: data.event.event_type,
          date: data.event.start_date ? parseInt(data.event.start_date.split('-')[2], 10) : null,
          start_date: data.event.start_date,
          fullData: finalData
        };
        setEvents(prev => [...prev, newEvent]);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    }

    setPendingEventData(null);
    setCurrentView('schedule');
  };

  const handleCancelVerification = () => {
    setPendingEventData(null);
    setCurrentView('capture');
  };

  const handleUpdateEvent = (updatedEvent) => {
    if (updatedEvent.isNew) {
      // It's a brand new event created manually from the schedule
      handleApproveEvent({
        ...updatedEvent.fullData,
        title: updatedEvent.title,
        start_date: updatedEvent.start_date || updatedEvent.date,
        end_date: updatedEvent.end_date || updatedEvent.start_date || updatedEvent.date,
        start_time: updatedEvent.time || updatedEvent.start_time,
        end_time: updatedEvent.fullData?.endTime || updatedEvent.endTime || updatedEvent.end_time || '',
        location: updatedEvent.fullData?.location || updatedEvent.location || '',
        event_type: updatedEvent.type || updatedEvent.event_type || 'Custom'
      });
      return;
    }

    // Otherwise it's just an edit to an existing frontend state event.
    // Ideally this should trigger a DB update too, but sticking to existing logic for now.
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={() => setUser(null)}
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
        {currentView === 'schedule' && <ScheduleView events={events} onUpdateEvent={handleUpdateEvent} />}
        {currentView === 'list' && <EventListView events={events} onUpdateEvent={handleUpdateEvent} />}
      </main>
    </div>
  );
}

export default App;
