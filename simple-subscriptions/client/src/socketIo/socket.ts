import io from 'socket.io-client';

var socket = io('http://localhost:1337/');

export default socket;

export const createServiceHeartbeat = (service, emitAlive, emitFail) => {
  const createNextHeartBeat = () => {
    setTimeout(serviceHeartbeat, 5000);
  };

  const serviceHeartbeat = () => {
    let failTimeout = setTimeout(() => {
      emitFail();
      createNextHeartBeat();
    }, 5000);

    socket.emit('service-status', service, (ack) => {
      clearTimeout(failTimeout);
      emitAlive();

      createNextHeartBeat();
    });
  };

  createNextHeartBeat();
};
