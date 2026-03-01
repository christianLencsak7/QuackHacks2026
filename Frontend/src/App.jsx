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
    // Normalise: verification form sends camelCase; API + DB expect snake_case.
    const payload = {
      title: finalData.title,
      start_date: finalData.start_date ?? finalData.startDate ?? null,
      end_date: finalData.end_date ?? finalData.endDate ?? null,
      start_time: finalData.start_time ?? finalData.startTime ?? null,
      end_time: finalData.end_time ?? finalData.endTime ?? null,
      location: finalData.location ?? null,
      event_type: finalData.event_type ?? finalData.typeTags?.[0] ?? 'Custom',
      notes: finalData.notes ?? null,
      host: finalData.host ?? null,
      cost: finalData.cost ?? null,
    };

    // ── Client-side validation ──────────────────────────────────────────────
    if (!payload.title?.trim()) {
      alert('Please enter an event title before saving.');
      return;
    }
    if (!payload.start_date) {
      alert('Please set a start date before saving.');
      return;
    }
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoRegex.test(payload.start_date)) {
      alert(`Invalid start date format "${payload.start_date}". Please use YYYY-MM-DD.`);
      return;
    }
    if (payload.end_date && !isoRegex.test(payload.end_date)) {
      alert(`Invalid end date format "${payload.end_date}". Please use YYYY-MM-DD.`);
      return;
    }
    if (payload.end_date && payload.end_date < payload.start_date) {
      alert('End date cannot be before start date.');
      return;
    }
    // ───────────────────────────────────────────────────────────────────────

    try {
      const res = await fetch('/api/create_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.event) {
        const newEvent = {
          id: data.event.id,
          title: data.event.title,
          time: data.event.start_time,
          type: data.event.event_type,
          start_date: data.event.start_date,
          end_date: data.event.end_date,
          fullData: { ...finalData, ...payload },
        };
        setEvents(prev => [...prev, newEvent]);
        setPendingEventData(null);
        setCurrentView('schedule');
      } else {
        console.error('[handleApproveEvent] API error:', data);
        alert(`Could not save event: ${data.error || 'Unknown error'}`);
        // Stay on the verification screen so the user can fix it
      }
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Network error — could not save event. Please try again.');
    }
  };

  const handleCancelVerification = () => {
    setPendingEventData(null);
    setCurrentView('capture');
  };

  const handleUpdateEvent = async (updatedEvent) => {
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

    // Optimistically update UI immediately
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));

    // Persist the date (and other field) changes to the DB
    try {
      await fetch(`/api/events/${updatedEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedEvent.title,
          start_date: updatedEvent.start_date,
          end_date: updatedEvent.end_date,
          start_time: updatedEvent.time || updatedEvent.start_time,
          end_time: updatedEvent.fullData?.endTime || updatedEvent.end_time || '',
          location: updatedEvent.fullData?.location || updatedEvent.location || '',
          event_type: updatedEvent.type || updatedEvent.event_type || '',
        }),
      });
    } catch (err) {
      console.error('Failed to update event on server:', err);
    }
  };

  const handleDeleteEvent = async (eventToDelete) => {
    // Optimistically remove from UI immediately
    setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
    // Best-effort DELETE to backend
    try {
      await fetch(`/api/events/${eventToDelete.id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete event from server:', err);
    }
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
        {currentView === 'schedule' && <ScheduleView events={events} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />}
        {currentView === 'list' && <EventListView events={events} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />}
      </main>
    </div>
  );
}

export default App;
