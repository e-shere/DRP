import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Claraify!
        </p>
        <a
          className="App-link"
          href="http://claraify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Info
        </a>
      </header>
    </div>
  );
}

export default App;
