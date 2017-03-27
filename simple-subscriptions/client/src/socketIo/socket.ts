import io from 'socket.io-client';

var socket = io('http://localhost:1337/');

export default socket;

export const createServiceHeartbeat = (service, emitAlive, emitFail) => {
  let nextHeartBeat;
  const createNextHeartBeat = () => setTimeout(serviceHeartbeat, 5000);

  const serviceHeartbeat = () => {
    let failTimeout = setTimeout(() => {
      emitFail();
      nextHeartBeat = createNextHeartBeat();
    }, 5000);

    socket.emit('service-status', service, (ack) => {
      clearTimeout(failTimeout);
      emitAlive();

      nextHeartBeat = createNextHeartBeat();
    });
  };

  nextHeartBeat = createNextHeartBeat();

  return {
    clear : () => {
      clearTimeout(nextHeartBeat);
    }
  }
};
