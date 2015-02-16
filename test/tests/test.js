describe('mainController', function(){

    var controller;
    var $scope;

    beforeEach(module('app'));

    beforeEach(inject(function($controller, $rootScope){
        $scope = $rootScope.$new();
        controller = $controller('mainController', {$scope: $scope});
    }));


    it('should set myVar', function(){
        controller.myVar.should.equal('Hello from main controller');
    })

})