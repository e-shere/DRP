import React from 'react';
import logo from './logo.svg';
import './App.css';
import { changeColor, changeFont } from './main.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <button onClick={changeColor}>
          Background colour
      </button>
      <button onClick={changeFont}>
          Font
      </button>
      </header>
    </div>
  );
}

export default App;
