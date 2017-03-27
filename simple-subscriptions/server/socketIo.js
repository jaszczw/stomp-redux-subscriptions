let clients = [];

const notifyClients = (msg) =>
    clients.forEach(socket => socket.emit(msg));

const notifyRoom = (io) => (room, msg) =>
    io.to(room).emit(msg);

module.exports = (io) => {
    io.on('connection', function (socket) {
        clients.push(socket);

        socket.on('subscribe', (entity, payload, cb) => {
            console.log(payload);
            socket.join(entity);
            //Maybe map 'unique-sub-id' to some entities events for example each modification etc.
            cb('unique-sub-id');
        });

        socket.on('unsubscribe', (entity, payload) => {
            socket.leave(entity);
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
