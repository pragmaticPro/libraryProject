angular.module('userService',[])

.factory('User',function($http){
    
    var userFactory ={};
    
    userFactory.createUser = function(userData){
        return $http.post('/api/register',userData);
    }
    userFactory.allUsers = function(){
        return $http.get('/api/users');
    }
    userFactory.deleteUser = function(id){
        return $http.delete('/api/user/'+id);
    }
    userFactory.getProfile = function(){
        return $http.get('/api/user');
    }
    userFactory.updateHiringHistory = function(bookId){
        return $http.put('/api/user/updateHiringHistory/'+bookId)
    }
    userFactory.getHiringHistory = function(){
        return $http.get('/api/user/hiringhistory')
    }
    userFactory.updatePassword = function(newPassword,oldPassword){
    return $http.put('/api/user/updatePassword/'+newPassword+'/'+oldPassword)
    }
    userFactory.returnBook = function(title){
        return $http.put('/api/user/returnBook/'+title)
    }
    userFactory.updateStock = function(bookId){
        return $http.put('/api/returnBook/updateStock/'+bookId)
    }


    return userFactory;
})

