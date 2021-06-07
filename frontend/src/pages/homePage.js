import React from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';

function Home() {
  const iconStyle = { color: 'white', fontSize: 40 };

  const search = () => {
    const query = document.getElementById('searchfield').value;
    console.log(query);
  }

  return (
    <div id='main'>
      <center>
        <input id='searchfield' type='text' placeholder='Type to search...' />

        <IconButton onClick={search}>
          <SearchRounded style={iconStyle} />
        </IconButton>
      </center>
    </div>
  );
}

export default Home;