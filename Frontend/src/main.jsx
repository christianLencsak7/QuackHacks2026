import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Manually register the service worker for Web Share Target support
if ('serviceWorker' in navigator) {
  console.log('[App] navigator.serviceWorker is supported');
  window.addEventListener('load', () => {
    console.log('[App] Registering service worker at /sw.js...');
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        console.log('[App] ✅ SW registered! Scope:', reg.scope);
        console.log('[App] SW state:', reg.installing ? 'installing' : reg.waiting ? 'waiting' : reg.active ? 'active' : 'unknown');
        reg.addEventListener('updatefound', () => {
          console.log('[App] SW update found, new worker installing...');
        });
      })
      .catch(err => console.error('[App] ❌ SW registration failed:', err));

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[App] SW controller changed — new SW has taken over');
    });
  });
} else {
  console.warn('[App] serviceWorker not supported in this browser/context');
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


