angular.module('bookService',[])

.factory('BookSer',function($http){
    
    var bookFactory ={};
    var tempBook ='';
    
    bookFactory.addBooks = function(bookData){
        return $http.post('/api/books',bookData)
    }
    bookFactory.getBooks = function(){
        return $http.get('/api/books')
    }
    bookFactory.loadBook = function(book){
        tempBook = book
    }
    bookFactory.getloadedBook = function(){
        return tempBook
    }
    return bookFactory;
})


