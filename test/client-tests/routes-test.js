describe('router', function () {
    var route;

    beforeEach(module('app'));

    beforeEach(inject(function ($route) {
        route = $route;
    }));

    it('should map home route to main controller', function () {
       route.routes['/'].controller.should.equal('mainController');
    });

    it('should map invalid routes to home route', function () {
        route.routes[null].redirectTo.should.equal('/');
    });
});

