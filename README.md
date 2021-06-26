# YouTube Party

## Description

YouTube Party, inspired by Netflix Party helps you to search and watch youtube videos together with your friends in real-time.

## Functionalities

1. Users can search for videos and about 20 results will be displayed in the home page.
2. Users can watch a video by clicking on any of the thumbnails.
3. Users will be redirected to player page with YouTube embed player with playback controls.
4. Other users will also be redirected to this page and if any user goes back to the search page, others will also be redirected to the search page so that everything is in sync. 
5. When watching a video, every playback change is synced across other devices i.e., if a user pauses their video, the player in other connected clients will also be paused. If a user seeks the player to a different time in the video, other players will also be seeked to the particular time.
6. The current time of the player is updated every second in the backend so that if a new user joins, the video will be played from the correct time.
6. These playback sync and redirections are taken care of by socket.io.

## Properties used

> - React: Components, Props, Events, Hooks, Router, Axios, Socket.io-client
> - Node: Googleapis, Express, Socket.io

## Run locally

1. Clone repository

        $ git clone https://github.com/sundeep-02/youtube-party.git
        $ cd youtube-party

2. You will be needing an API key from Google developer console to access the YouTube Data API.

3. Go to https://console.cloud.google.com/, get an API key and store in a .env file in the backend.

3. Run Backend

        $ cd backend/
        $ npm install
        $ npm start

4. Run frontend on a new terminal

        $ cd frontend/
        $ npm install
        $ npm start

## Future Work

- Add functionality to create and join rooms.