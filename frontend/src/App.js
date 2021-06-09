import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Player from './pages/playerPage';
import Home from './pages/homePage';

function App() { 
  return (
    <Router>
      <header>
        <Link to='/' id='heading'>
          <img src='../images/youtube_party.png' alt='icon' id='icon' />
        </Link>
      </header>
      <div>
        <Switch>
          <Route path='/video/:videoID' component={Player} />
          <Route path='/' exact={true} component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;