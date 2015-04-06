var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
var app = express();
var config = require('./server/config/config')[env];
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./server/config/express')(app);

require('./server/config/mongoose')(config);

require('./server/config/sessions')(app);

require('./server/config/models');

var shouldSeed = true;
if (shouldSeed) {
    require('./server/seeds/seed')(); 
}

require('./server/config/passport')();

require('./server/config/sockets').init(io);

require('./server/config/routes')(app, config);

server.listen(config.port, function() {
    console.log('Listening on port ' + config.port + '...');
});
