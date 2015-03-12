describe('MainController', function(){
    var controller;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_){
        controller = _$controller_('MainController', {$scope: {}});
    }));


    it('should set myVar', function(){
        controller.myVar.should.equal('Hello From Main Controller');
    });
});
