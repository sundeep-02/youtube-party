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
  const [notSearched, setNotSearched] = useState(true);

  useEffect(() => {
    socket.emit('toHome');
    return () => { socket.disconnect(); }
  });

  socket.once('redirectToPlayer', (data) => {
    props.history.push('/video/'+data);
  });

  const search = async () => {
    setNotSearched(false);
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

      { notSearched && <center><p id='para'>
        <span>Welcome to <em>YouTube Party!</em></span><br/>
        Search YouTube videos and watch them along with your friends in <em>real-time</em>.
        </p></center> }

      <div id='parent'>
      { videos && videos.map(video => 
      <Link to={'/video/'+video.id.videoId} key={video.id.videoId} style={{ textDecoration: 'none' }}>
        <div className='child'>
          <img className='thumbnail' src={video.snippet.thumbnails.medium.url} alt={video.id.videoId}/>
          <p className='title'>{video.snippet.title}</p>
        </div>
      </Link> )}
      </div>
    </div>
  );
}

export default Home;