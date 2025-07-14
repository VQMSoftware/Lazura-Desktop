import React from 'react';
import ReactDOM from 'react-dom/client';

// Polyfill global for React deps in electron renderer
(window as any).global = window;

function App() {
  return <h1>Hello Electron + React + TypeScript!</h1>;
}

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
