import React, { Component } from 'react';
import Albums from "./components/albums"
//import Events from "./components/events"
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Albums />
      </div>
    );
  }
}

export default App;
