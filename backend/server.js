import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const options = { 
    cors: true,
    origins: ["http://127.0.0.1:5000"],
};
const io = new socketio.Server(server, options);

var playerState = -1;
var currentTime = 0;

const socket = io.on('connection', (obj) => {
    obj.on('redirect', (data) => {
        console.log(data);
        obj.broadcast.emit('redirectTo', data);
    });

    obj.on('setPlayerState', (data) => {
        playerState = data;
        obj.broadcast.emit('getPlayerState', playerState);
    });

    obj.on('setCurrentTime', (data) => {
        currentTime = data;
    });

    obj.on('ready', () => {
        obj.emit('getCurrentTime', currentTime);
    });

    obj.on('syncVideo', (data) => {
        currentTime = data;
        obj.broadcast.emit('getCurrentTime', currentTime);
    });

    obj.on('disconnect', () => {
        if(io.engine.clientsCount == 0) {
            playerState = -1;
            currentTime = 0;
        }
    });
});

app.get('/api/search/:query', async (req, res) => {
    const query = req.params.query;

    google.youtube('v3').search.list({
        key: process.env.API_KEY,
        part: 'snippet',
        q: query,
        maxResults: 10
    })
    .then((response) => {
        console.log(response.data.items);
        res.send(response.data.items);
    })
    .catch((error) => {
        console.log(error);
    })
});

server.listen(5000, () => {
    console.log('Server started at http://localhost:5000');
});