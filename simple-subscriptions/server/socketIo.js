let clients = [];

const notifyClients = (msg) =>
    clients.forEach(socket => socket.emit(msg));

module.exports = (io) => {
    io.on('connection', function (socket) {
        clients.push(socket);

        socket.on('service-status', (service, cb) => {
            const random = Math.random();
            if (service && random < 0.9) cb('alive');
        });

        socket.on('disconnect', () => {
            clients = clients.filter((s) => s.id = socket.id);
        });
    });

    return {
        notifyClients
    }
}
