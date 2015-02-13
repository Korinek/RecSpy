var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var config = require('./config/config')[env];

require('./config/express')(app, config);

/*require('./server/config/mongoose')(config);

require('./server/config/passport')();
*/
require('./config/routes')(app);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');