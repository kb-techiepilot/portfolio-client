import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Loading, PrivateRoute } from "./components";
import { Dashboard } from './views';

import './App.css';
import './temp.css';

function App() {
  return (
    <Router>
      <div>
        <header>
          <Navbar />
        </header>
        <Switch>
          {/* <main>  */}
            <Route path="/loading" exact component={ Loading } />
            {/* <PrivateRoute path="/" exact component={ Dashboard } /> */}
            <PrivateRoute path="/dashboard" component={ Dashboard } />
            <Route path="/" exact component={Dashboard} />
          {/* </main> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
