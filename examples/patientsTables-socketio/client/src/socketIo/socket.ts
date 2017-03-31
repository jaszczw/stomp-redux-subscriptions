import io from 'socket.io-client';

var socket = io('http://localhost:1337/');

export default socket;

export const createServiceHeartbeat = (service, emitAlive, emitFail) => {
  let nextHeartBeat, failTimeout;
  const createNextHeartBeat = () => {
    clearTimeout(nextHeartBeat);
    return setTimeout(serviceHeartbeat, 5000);
  };

  const serviceHeartbeat = () => {
    failTimeout && clearTimeout(failTimeout);
    failTimeout = setTimeout(() => {
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
      nextHeartBeat && clearTimeout(nextHeartBeat);
      failTimeout && clearTimeout(failTimeout);
    }
  }
};
