import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Player from './pages/playerPage';
import Home from './pages/homePage';

function App() { 
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/video/:videoID' component={Player} />
          <Route path='/' exact={true} component={Home} />
        </Switch>
        {/* <Player videoID = { 'Db1NdYbQhAA' }/> */}
      </div>
    </Router>
  );
}

export default App;