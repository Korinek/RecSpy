var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    dev: {
        db: 'mongodb://localhost/recspy',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    build: {
        rootPath: rootPath,
        db: process.env.MONGO_PROD,
        port: process.env.PORT || 3030
    }
};