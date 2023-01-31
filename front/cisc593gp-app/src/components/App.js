import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
        <div className="App">
            <div className="App">
                <header className="App-header">
            </header>
        </div>
        <br/>
        <br/>
        <div className='App-body'>
            <PrivateRoute exact path='/' component={Home} />
        </div>
    </div>   

</Router>
  );
}

export default App;
