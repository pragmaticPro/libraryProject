describe('testing angular',function(){
    describe('testing search controller',function(){
        it('testing title in scope initialization', function(){
            angular.mock.module('myapp');
            
            var scope={};
            var ctrl;
            angular.mock.inject(function($controller){
                ctrl = $controller('registerController',{$scope:scope});
            });
             expect(scope.title).toBeDefined();
        });
    });
});

// inject will inject angular components 
           