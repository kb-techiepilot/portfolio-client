import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar, Loading, PrivateRoute } from "./components";

import { Dashboard } from './views';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <Router>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/loading" exact component={ Loading } />
            {/* <PrivateRoute path="/" exact component={ Dashboard } /> */}
            <Route path="/dashboard" component={ Dashboard } />
            <Route path="/" exact component={Dashboard} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
