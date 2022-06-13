import React from 'react';
import logo from './logo.svg';
import './App.css';
import { changeColor } from './main.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <button onClick={changeColor}>
          Background colour
      </button>
      </header>
    </div>
  );
}

export default App;
