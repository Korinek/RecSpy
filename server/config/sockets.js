var getGymPopulationPercentage = function(gym) {
    return (parseFloat(gym.checkedInMembers.length) / gym.maxCapacity) * 100;
};

var allSockets = [];

exports.init = function(io) {
    console.log('initializing sockets');
    io.on('connection', function(socket) {
        console.log('Adding a new socket.');
        allSockets.push(socket);
    });
};

exports.emitPopulationPercentage = function(gym) {
    var percentage = getGymPopulationPercentage(gym);
    console.log('Sending population change for ' + gym.name + ' of ' + percentage + '%');
    allSockets.forEach(function(socket) {
        socket.emit(gym.name, {
            currentPopulationPercentage: percentage
        });
    });
};
