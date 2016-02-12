// name of the test and function to implement the code
describe('Test Suite', function(){
    describe('testing search controller', function(){
        it('should initialize the title in the scope', function(){
           //module function provided by angular mocks adds app to our test
            angular.mock.module('myapp');
            var scope ={};
            var ctrl ;
            // inject function provided by angular mocks injects angular components to our test
            angular.mock.inject(function($controller){
                ctrl = $controller('searchController',{$scope:scope});
            });
            // expect matcher from jasmine
            expect(scope.title).toBeDefined();
            expect(scope.title).toBe('search books');
        });
        
    });
    
    
});