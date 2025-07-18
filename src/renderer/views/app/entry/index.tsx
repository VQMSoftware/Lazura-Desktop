import React from 'react';
import ReactDOM from 'react-dom/client';
import Titlebar from '../../titlebar';
import Toolbar from '../../toolbar';

function App() {
  return (
    <>
      <Titlebar />
      <Toolbar />
    </>
  );
}

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
