var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/recspy',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW +'@ds045511.mongolab.com:45511/recspy',
        port: process.env.PORT || 80
    }
}