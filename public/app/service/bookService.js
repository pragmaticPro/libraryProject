angular.module('bookService',[])

.factory('book',function($http){
    
    var bookFactory ={};
    
    bookFactory.addBooks = function(bookData){
        return $http.post('/api/books',bookData);
    }
    
    bookFactory.getBooks = function(){
        return $http.get('/api/books')
    }
})


