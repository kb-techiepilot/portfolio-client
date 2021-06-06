import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { NavBar, Loading, PrivateRoute } from "./components";

import { Dashboard } from './views';

function App() {
  
  return (
    <Router>
        <div className="App">
          <NavBar />
          <Switch>
            <PrivateRoute path="/loading" exact component={ Loading } />
            <PrivateRoute path="/" exact component={ Dashboard } />
            <PrivateRoute path="/dashboard" component={ Dashboard } />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
