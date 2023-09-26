const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketio(server);

app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

io.on('connection', (socket) => {
	// console.log(`A User Connected on Socket: ${socket}`);
});