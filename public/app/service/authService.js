angular.module('authService',[])


.factory('Auth',function($http,$q,AuthToken){
    
    var authFactory ={} // all routes will be put it in here
    
    authFactory.login = function(email,password){
        //fetch data from service
        return $http.post('/api/login',{
            email:email,
            password:password
        })
        // it is a promise function , if all ok then run success
        .success(function(data){
            AuthToken.setToken(data.token);
            return data;
        });
    }
    
    authFactory.logout = function(){
        AuthToken.setToken();
    }
    
    authFactory.isLoggedIn = function(){
        if(AuthToken.getToken())
            return true;
        else
            return false;
    }
    
    authFactory.getUser = function(){
        if(AuthToken.getToken()){
            return $http.get('/api/me');
        }
            
        else
            return $q.reject({message:"User has token"});
    }
    
    return authFactory;
}) 



.factory('AuthToken',function($window){
    
    var authTokenFactory = {};
    
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    }
    
    authTokenFactory.setToken = function(token){
        if(token){
            $window.localStorage.setItem('token',token);
        }else{
            $window.localStorage.removeItem('token');
        }
        
    }
    return authTokenFactory;
})



.factory('AuthInterceptor',function($q,$location,AuthToken){
    
    var interceptorFactory ={};
    
    interceptorFactory.request = function(config){
        
        var token = AuthToken.getToken();
        if(token){
            config.headers['x-access-token']= token;
            
        }
        return config;
    };
    // if user is not authenticated , he will be directed to login page
    interceptorFactory.responseError = function(response){
        if(response.status ==403)
            $location.path('/login');
        return $q.reject(response);
    }
    return interceptorFactory;
    
});

//$httpProvider.interceptors.push('AuthInterceptor');