module.exports = function () {
    var client = './client/';
    var clientApp = client + 'app/';
    var temp = './.temp/';

    var config = {

        /*
         * File paths.
         * */
        alljs: [
            clientApp + '**/*.js',
            './server/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'site.css',
        html: clientApp + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        index: client + 'index.html',
        js: [
            clientApp + 'app.js',
            clientApp + '**/*.js'
        ],
        stylus: client + 'styles/site.styl',
        temp: temp,
        server: './server',

        /*
         * Template cache
         * */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                standAlone: false,
                root: 'app/'
            }
        },

        /*
         * Browser sync
         * */
        browserReloadDelay: 1000,

        /*
         * Bower and NPM locations
         * */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '..'
        },

        /*
         * Node settings
         * */
        defaultPort: 7203,
        nodeServer: './server.js'

    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};