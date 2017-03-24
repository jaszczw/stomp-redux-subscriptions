const CONNECTION_ERROR = 'Connection-error';

const createConnectionTimeout = (emitter, timeout) => setTimeout(() =>
  emitter({error: CONNECTION_ERROR}),
  timeout
);

export const createStateHandlerFactory = (emitter, timeout) => {
  //On creation will start countdown for 'connection error'
  let timer = createConnectionTimeout(emitter, timeout);

  //We notify that client is alive and restart the connection error timeout;
  return (stomp) => (message) =>  {
    clearTimeout(timer);
    timer = createConnectionTimeout(emitter, timeout);

    const heartBeatTarget = message.headers['reply-to'];
    stomp.send(heartBeatTarget, '');
  };
};
