import io from 'socket.io-client';

var socket = io('http://localhost:1337/');

export default socket;
