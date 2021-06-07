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
import { 
  IconButton,
  Slider,
  Grid
} from '@material-ui/core';

var player;
var playerState;
var duration = 0;

/*eslint-disable eqeqeq*/
function Player(props) {
  const socket = io('http://127.0.0.1:5000');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const iconStyle = { color: 'white', fontSize: 40 };

  const opts = {
    height: '563',
    width: '1000',
    playerVars: {
      autoplay: 0,
      controls: 0,
      origin: window.location,
    },
  };

  const onPlayerReady = (event) => {
    player = event.target;
    duration = player.getDuration();

    setInterval(() => {
      if(playerState == 1) {
        socket.emit('setCurrentTime', player.getCurrentTime());
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);

    socket.emit('ready');
  }

  useEffect(() => {
    console.log(props.match.params.videoID);
    socket.emit('redirect', props.match.params.videoID);
    return () => {
      socket.disconnect();
      setIsPlaying();
      setCurrentTime();
    }
  }, []);

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

  socket.on('redirectTo', (data) => {
    console.log(data);
    props.history.push('/video/'+data);
  });

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
        break;
      default:
        break;
    }
  });

  socket.on('getCurrentTime', (data) => {
    player.seekTo(data);
    setCurrentTime(data);
  });

  const pauseVideo = () => {
    player.pauseVideo();
    setIsPlaying(false);
  }

  const playVideo = () => {
    player.playVideo();
    setIsPlaying(true);
  }

  const rewindVideo = (seconds) => {
    player.seekTo(currentTime - seconds);
    socket.emit('syncVideo', currentTime - seconds);
    setCurrentTime(currentTime - seconds);
  }

  const forwardVideo = (seconds) => {
    player.seekTo(currentTime + seconds);
    socket.emit('syncVideo', currentTime + seconds);
    setCurrentTime(currentTime + seconds);
  }

  const setTime = (event, value) => {
    setCurrentTime(value);
  }

  const seekPlayerTo = (event, value) => {
    player.seekTo(value);
    socket.emit('syncVideo', value);
  }

  const secondsToMinutes = (seconds) => {
    var min = Math.trunc(seconds / 60);
    var sec = Math.trunc(seconds % 60);
    if(min<10) { min = '0'+min }
    if(sec<10) { sec = '0'+sec }
    const val = min+':'+sec;
    return val;
  }
  
  return (
    <div id='ytPlayer'>
      <center>
      <YouTube
      id='video'
      videoId={props.match.params.videoID}
      opts={opts}
      onReady={onPlayerReady}
      onStateChange={onStateChange}
      />

      <Grid container spacing={2}>
        <Grid item>
          {secondsToMinutes(currentTime)}
        </Grid>
        <Grid item xs>
          <Slider 
            color='secondary' 
            value={currentTime}
            max={duration} 
            step={1}
            onChange={setTime} 
            onChangeCommitted={seekPlayerTo}
          />
        </Grid>
        <Grid item>
         {secondsToMinutes(duration)}
        </Grid>
      </Grid>

      <IconButton onClick={() => {rewindVideo(5)}}>
        <Replay5Rounded style={iconStyle} />
      </IconButton>

      <IconButton onClick={() => {rewindVideo(10)}}>
        <Replay10Rounded style={{...iconStyle, fontSize: 45}} />
      </IconButton>

      { 
      isPlaying ? 
      <IconButton onClick={pauseVideo}>
        <PauseRounded style={{...iconStyle, fontSize: 60}} />
      </IconButton> : 
      <IconButton onClick={playVideo}>
        <PlayArrowRounded style={{...iconStyle, fontSize: 60}} />
      </IconButton>
      }

      <IconButton onClick={() => {forwardVideo(10)}}>
        <Forward10Rounded style={{...iconStyle, fontSize: 45}} />
      </IconButton>

      <IconButton onClick={() => {forwardVideo(5)}}>
        <Forward5Rounded style={iconStyle} />
      </IconButton>

    </center>
    </div>
  );
}

export default Player;