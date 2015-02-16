describe('mainController', function(){
    var controller;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_){
        controller = _$controller_('mainController', {$scope: {}});
    }));


    it('should set myVar', function(){
        controller.myVar.should.equal('Hello from main controller');
    });
});