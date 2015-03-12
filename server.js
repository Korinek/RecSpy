var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
var app = express();
var config = require('./server/config/config')[env];

require('./server/config/express')(app);

require('./server/config/mongoose')(config);

require('./server/config/sessions')(app);

require('./server/config/models');

require('./server/config/passport')();

require('./server/config/routes')(app, config);

app.listen(config.port, function () {
    console.log('Listening on port ' + config.port + '...');
});
