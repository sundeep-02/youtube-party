import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { io } from 'socket.io-client';
import '../App.css';
import { 
  PlayArrowRounded,
  PauseRounded,
  Replay5Rounded,
  Forward5Rounded,
  Replay10Rounded,
  Forward10Rounded,
} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const socket = io('http://127.0.0.1:5000');
var player;
var playerState;
var currentTime;

/*eslint-disable eqeqeq*/
function Player(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const iconStyle = { color: 'white', fontSize: 40 };

  const opts = {
    height: '563',
    width: '1000',
    playerVars: {
      autoplay: 0,
      controls: 1,
      origin: window.location,
    },
  };

  const onPlayerReady = (event) => {
    player = event.target;

    setInterval(() => {
      currentTime = player.getCurrentTime();
      if(playerState == 1) {
        socket.emit('setCurrentTime', currentTime);
      }
    }, 1000);

    socket.emit('ready');
  }

  const onStateChange = () => {
    playerState = player.getPlayerState();
    if (playerState == 1) {
      setIsPlaying(true);
      socket.emit('setPlayerState', playerState);
    }
    else if (playerState == 2) {
      setIsPlaying(false);
      socket.emit('setPlayerState', playerState);
    }
  }

  socket.on('getPlayerState', (data) => {
    playerState = data;
    switch (playerState) {
      case 1:
        player.playVideo();
        break;
      case 2:
        player.pauseVideo();
        break;
      case 3:
        player.pauseVideo();
        break
      default:
        //
    }
  });

  socket.on('getCurrentTime', (data) => {
    currentTime = data;
    player.seekTo(currentTime);
  });

  useEffect(() => {
    //
    return () => {
      socket.disconnect();
    }
  }, []);

  const pauseVideo = () => {
    player.pauseVideo();
    setIsPlaying(false);
  }

  const playVideo = () => {
    player.playVideo();
    setIsPlaying(true);
  }

  const rewindVideo = (seconds) => {
    currentTime = currentTime - seconds
    player.seekTo(currentTime);
    socket.emit('syncVideo', currentTime);
  }

  const forwardVideo = (seconds) => {
    currentTime = currentTime + seconds
    player.seekTo(currentTime);
    socket.emit('syncVideo', currentTime);
  }
  
  return (
    <center>
    <div id='ytPlayer'>
      <YouTube
      id='video'
      videoId={props.videoID}
      opts={opts}
      onReady={onPlayerReady}
      onStateChange={onStateChange}
      />

      <IconButton onClick={ () => {rewindVideo(5)} }>
        <Replay5Rounded style={iconStyle} />
      </IconButton>

      <IconButton onClick={ () => {rewindVideo(10)} }>
        <Replay10Rounded style={{...iconStyle, fontSize: 45}} />
      </IconButton>

      { 
      isPlaying ? 
      <IconButton onClick={ pauseVideo }>
        <PauseRounded style={{...iconStyle, fontSize: 60}} />
      </IconButton> : 
      <IconButton onClick={ playVideo }>
        <PlayArrowRounded style={{...iconStyle, fontSize: 60}} />
      </IconButton>
      }

      <IconButton onClick={ () => {forwardVideo(10)} }>
        <Forward10Rounded style={{...iconStyle, fontSize: 45}} />
      </IconButton>

      <IconButton onClick={ () => {forwardVideo(5)} }>
        <Forward5Rounded style={iconStyle} />
      </IconButton>
    </div>
    </center>
  );
}

export default Player;