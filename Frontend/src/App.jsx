import React, { useState, useEffect } from 'react';
import AuthPage from './features/auth/AuthPage';
import Sidebar from './features/navigation/Sidebar';
import CaptureView from './features/capture/CaptureView';
import ScheduleView from './features/schedule/ScheduleView';
import EventVerificationView from './features/verification/EventVerificationView';
import { get, del } from 'idb-keyval';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('capture');
  const [pendingEventData, setPendingEventData] = useState(null);
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
    console.log('Event confirmed:', finalData);
    setPendingEventData(null);
    setCurrentView('schedule');
  };

  const handleCancelVerification = () => {
    setPendingEventData(null);
    setCurrentView('capture');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={() => setIsAuthenticated(false)}
      />
      <main className="flex-1 relative h-full flex flex-col min-w-0">
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
        {currentView === 'schedule' && <ScheduleView />}
      </main>
    </div>
  );
}

export default App;
