import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar, Loading, PrivateRoute } from "./components";
import { Dashboard, Transaction } from './views';

import './App.css';
import './temp.css';
import Wishlist from './views/Wishlist/Wishlist';
import Holdings from './views/Holdings/Holdings';
import Profile from './views/Profile/Profile';

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
            <PrivateRoute path="/dashboard" exact component={ Dashboard } />
            <PrivateRoute path="/transaction" exact component={ Transaction } />
            <PrivateRoute path="/holdings" exact component={ Holdings } />
            <PrivateRoute path="/wishlist" exact component={ Wishlist } />
            <PrivateRoute path="/profile" exact component={ Profile } />
            <Route path="/" exact component={Dashboard} />
          {/* </main> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
