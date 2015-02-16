module.exports = function (app) {
    app.get('/partials/*', function (req, res) {
        console.log('------' + req.params[0]);
        res.render('../../public/app/' + req.params[0]);
    });

    app.get('*', function (req, res) {
        console.log('----rendering index----');
        res.render('index');
    });
};