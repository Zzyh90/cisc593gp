import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home';
import PrivateRoute from './PrivateRoute';

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
