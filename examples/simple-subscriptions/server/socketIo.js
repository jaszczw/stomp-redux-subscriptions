let clients = [];

const notifyClients = (msg) =>
    clients.forEach(socket => socket.emit(msg));

const notifyRoom = (io) => (room, msg) =>
    io.to(room).emit(msg);

const clientsStates = {};

const getSubscriptions = socket =>
    clientsStates[socket.id].subscriptions;

module.exports = (io) => {
    io.on('connection', function (socket) {
        clients.push(socket);
        clientsStates[socket.id] = {
            subscriptions: []
        };

        socket.on('subscribe', (entity, payload, cb) => {
            socket.join(entity);
            //Instead of just entity also payload should be tracked - but we have room per entity that's why.
            clientsStates[socket.id].subscriptions.push(entity);
            cb('unique-sub-id');
        });

        socket.on('unsubscribe', (entity) => {
            const subscriptions = getSubscriptions(socket);
            const index = subscriptions.indexOf(entity);
            subscriptions.splice(index,1);

            if (!subscriptions.filter((e) => e === entity).length) {
                socket.leave(entity);
            }
        });

        socket.on('service-status', (service, cb) => {
            const isAlive = Math.random() < 0.9;
            console.log(`Service ${service} status: ${isAlive}`);
            if (service && isAlive) cb('alive');
        });

        socket.on('disconnect', () => {
            clients = clients.filter((s) => s.id = socket.id);
        });
    });

    return {
        notifyClients,
        notifyRoom: notifyRoom(io),
    };
};
