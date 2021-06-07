import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';

function Home(props) {
  const socket = io('http://127.0.0.1:5000');

  const iconStyle = { color: 'white', fontSize: 40 };
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    //
    return () => { socket.disconnect(); }
  });

  socket.on('redirectTo', (data) => {
    console.log(data);
    props.history.push('/video/'+data);
  });

  const search = async () => {
    const query = document.getElementById('searchfield').value;
    const { data } = await axios.get('/api/search/' + query);
    setVideos(data);
  }

  return (
    <div id='main'>
      <center>
        <input id='searchfield' type='text' placeholder='Type to search...' />

        <IconButton onClick={search}>
          <SearchRounded style={iconStyle} />
        </IconButton>
      </center>

      { videos.map(video => <p id='para'><Link to={'/video/'+video.id.videoId}>{ video.snippet.title }</Link></p>) }
      
    </div>
  );
}

export default Home;