import io from 'socket.io-client';

var socket = io('http://localhost:1337/');

export default new Promise<io> ((resolve, reject) => {
  socket.on('connect', function () {
    resolve(socket);
    console.info('connected');
  });
});
