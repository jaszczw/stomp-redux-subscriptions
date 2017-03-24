const handlersHash = {};

const addHandler = (subscription, handler) => {
  handlersHash[subscription] = handler;
};

const getHandler = (subscription)  =>
  handlersHash[subscription];

const removeHandler = (subscription)  =>
  delete handlersHash[subscription];

export {
  addHandler,
  getHandler,
  removeHandler
}
