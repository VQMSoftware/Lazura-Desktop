import React from 'react';
import ReactDOM from 'react-dom/client';

(window as any).global = window;

import Titlebar from '../../titlebar';

function App() {
  return (
    <>
      <Titlebar />
      {/* TODO: implament more app controls. */}
    </>
  );
}

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
