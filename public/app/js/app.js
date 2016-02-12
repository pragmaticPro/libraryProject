            var myapp = angular.module('myapp',['ngRoute','ngMessages','ngResource','bookService','authService','userService'])

        // login first and then access library services    
        myapp.config(function($httpProvider){
            $httpProvider.interceptors.push('AuthInterceptor');
        })


        myapp.config(function($routeProvider,$locationProvider){

            $routeProvider
            .when("/search",{
               templateUrl:'search.html',
                controller:'searchController'

            })
            .when("/addBooks",{
               templateUrl:'addBooks.html',
                controller:'addBooksController'

            })

            .when("/showHiredBooks",{
                templateUrl: 'hiredBooks.html',
                controller:'searchController'

             })

             .when("/showBooks",{
               templateUrl:'showBooks.html',
               controller:'booksCollectionController'

            })

            .when('/showUsers',{
                templateUrl:'registeredUsers.html',
                controller:'userController'
            })

            .when("/news",{

                templateUrl:'news.html',
                controller:'newsController'

            })

            .when("/readBook",{

                templateUrl:'readBook.html',
                controller:'searchController'

            })

            .when("/register",{

                templateUrl:'register.html',
                controller:'registerController'

            })
            .when("/return",{

                templateUrl:'return.html',
                controller:'userController'

            })

            .when("/login",{

                templateUrl:'login.html',
                controller:'loginController'

            })
              .when("/changePassword",{

                templateUrl:'changepassword.html',
                controller:'loginController'

            })


            .otherwise({
                    redirectTo: '/'
            })

        });



        // User is service inside UserService.js
    myapp.controller("userController",function($scope,User){

            // fetching from service , that service fetch from api
            var vm  = this;


            vm.getProfile = function(){
                User.getProfile()
                    .success(function(data){
                        vm.users= data;

                    });
            };

            vm.allUsers = function(){
                User.allUsers()
                      .success(function(data){
                         vm.users = data;
                })
            };


            vm.deleteUser = function(id){
                User.deleteUser(id)
                    .success(function(data){
                        vm.message = data.message;
                            alert("User has been successfully deleted");
                            User.allUsers()
                            .success(function(data){
                                vm.users= data;
                            });

                });

            };

            vm.returnBook = function(title){

                User.returnBook(title)
                    .success(function(data){
                        vm.message = data.message;
                })
                    .error(function(data){
                    console.log('Error:'+ data);
                })
            };

            vm.updateStock = function(book){

                 book.checked= true;
    //             $scope.checked=book.checked; 
                 User.updateStock(book._id)
                    .success(function(data){
                        vm.message = data.message
                 })
                    .error(function(data){
                     console.log('Error:'+ data);
                 })

            };

            // fetching directly from api

        //    $scope.showUsers = function(){
        //          
        //        $http.get('/api/users')
        //            .success(function(data){
        //                $scope.users = data ;  
        //        })
        //            .error(function(data){
        //            console.log('Error:'+ data);
        //        });
        //    
        //    }
        });


        myapp.controller("registerController",['$scope','$location','$window','User',function($scope,$location,$window,User){

            $scope.title ="register controller";
            var vm = this;
            vm.signupUser = function(){
                vm.message ='';

                User.createUser(vm.userData)
                    .then(function(response){
                    vm.userData ={};
                    vm.message = response.data.message;
                    alert("You are now registered");
                    $location.path('/login');
                })
            }
        }])



        myapp.controller("loginController",['$rootScope','$location','$http','$log','$filter','$resource','Auth','User',function($rootScope,$location,$http,$log,$filter,$resource,Auth,User){

            var vm = this;
            vm.loggedIn = Auth.isLoggedIn();
            // event listener for route change
            $rootScope.$on('$routeChangeStart',function(){
                vm.loggedIn = Auth.isLoggedIn();
                Auth.getUser()
                    .then(function(data){
                     vm.user = data.data;
                });
            });

            vm.doLogin = function(){
                vm.processing = true;
                vm.error ='';
                Auth.login(vm.loginData.email, vm.loginData.password)
                    .success(function(data){
                    vm.processing = false;
                    Auth.getUser()
                        .then(function(data){
                         vm.user = data.data;
                    });
                    // if login is successful direct user to home page
                    if(data.success)
                        $location.path('/');
                    else
                        vm.error = data.message;
                });
            }

            vm.logout  = function (){
                Auth.logout();
                // if log out is success, direct user to log out page
                $location.path('/logout');
            };


            vm.getProfile = function(){
                User.getProfile()
                    .success(function(data){
                        vm.users= data;

                    });
            };

            vm.changePassword = function(){     User.updatePassword(vm.passwordData.newpassword,vm.passwordData.oldpassword)
                    .success(function(data){
                    vm.message = data.message;
                    if(data.message==="password successfully updated"){
                          $location.path('/search');
                    }else{
                         $location.path('/changePassword');
                    }

                });

            };

        }]);



        myapp.controller("newsController",['$scope','$log','$filter','$resource',function($scope,$log,$filter,$resource){

        }]);


myapp.controller("eventsController", ['$scope','$log','$resource','$filter',function($scope,$log,$resource,$filter){
    
    $scope.word ="";
    $scope.speak = function(word){
         var msg = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(msg);
    
    }
   

    
   
    
//travelPlanner.controller("countriesController", ['$scope','$log','$resource','$filter','sharedProperties',function($scope,$log,$resource,$filter,sharedProperties){
//    
//    $scope.countryName ='';
//    $scope.checked='';
//    
//    $scope.getAPI = function(country){
//    $scope.countryAPI =$resource("https://restcountries-v1.p.mashape.com/name/:name?mashape-key=13LucHtvfdmshcRGtkIIa97UFqGxp1YRPgHjsnVJxnbS7QIify",{name:"@name"},{ callback: "JSON_CALLBACK" }, { query: { method: "GET",isArray:true   }});
//    
//    $scope.countryResult=$scope.countryAPI.query({name:country});
//    //console.log($scope.countryResult.name);
//    $scope.checked='checked';
//    //console.log("selectedDestination"+$scope.getValue());
//}    
//    
//    
//}]); // end of controller
    
}]);
////////////////////////////////////////////////////////////////////





        myapp.controller("searchController",['$scope','$http','$log','$filter','$resource','BookSer','Auth','User',function($scope,$http,$log,$filter,$resource,BookSer,Auth,User){
            
            $scope.title ="search books";

             var vm = this;                                
            $scope.searchTitle = function(title){
                $http.get('/api/books/book/'+ title)
                    .success(function(data){
                        $scope.books =data;

                    })

                    .error(function(data){
                        $scope.error = data.message;
                    });

                };

            $scope.searchAuthor = function(author){
                $http.get('/api/books/'+ author)
                    .success(function(data){
                        $scope.books =data;

                    })

                    .error(function(data){
                        console.log('Error:'+data);
                    });

                };

            $scope.searchSubject = function(subject){
                $http.get('/api/books/boo/'+ subject)
                    .success(function(data){
                        $scope.books =data;
                    })

                    .error(function(data){
                        console.log('Error:'+data);
                    });

                };

              $scope.updateHiringHistory = function(book){
                  $scope.updated ="checked";
                  $http.put('/api/user/updateHiringHistory/'+book._id)
                    .success(function(data){
                      $scope.user = data;

                  })
                    .error(function(data){
                      console.log("Error:"+ data);
                  });
              };                              


             $scope.rentMe = function(book){
                 book.checked= true;
                 $scope.checked=book.checked;  
                 $http.put('/api/hiredBooks/'+book._id)
                     .success(function(data){
                         $scope.hiredBooks = data;
                         $scope.hiredBooks.checked= book.checked;
                         alert("Book rented");
                     })
                     .error(function(data){
                         console.log('Error:'+ data);
                     });
                 };


              $scope.showHiredBooks = function(hireBookDetails){

                  $http.get('/api/hiredBooks/'+hireBookDetails)
                    .success(function(data){
                      $scope.hiredBooks = data;
                  })
                    .error(function(data){
                      console.log('Error:'+ data);
                  });
              };
            
            $scope.readMe = function(book){
                
                $scope.author = book.author;
                $scope.title = book.title;
                $scope.booktext = book.body;
                var msg = new SpeechSynthesisUtterance(book.body);
                window.speechSynthesis.speak(msg);
               
    
            };
            // put to service
            $scope.loadMe = function(book){
               BookSer.loadBook(book);
            };
            // get from service
            $scope.unloadMe = function(){
             return BookSer.getloadedBook()
            };
   

        }]); // search controller


        myapp.controller("addBooksController",['$scope','$http','$log','$filter','$resource',function($scope,$http,$log,$filter,$resource){
            // these 4 variables will do  data binding, html has ng-modal with same names
            $scope.book ={};
         

            // assigning values from ng-modal data bound variables to book object
            $scope.addBook = function(){
                $scope.checked ="checked";
                 $http.post('/api/books',$scope.book)
                        .success(function(data){
                            $scope.book ={};
                            $scope.books = data;
                            $scope.message = data.message;

                        })

                        .error(function(data){
                            console.log("Error"+data);

                        });
               }




        }]); 


        /////////////////////////////////////////////////////////////////

        myapp.controller("booksCollectionController",['$scope','$http','$log','$filter','$resource',function($scope,$http,$log,$filter,$resource){



            $scope.showBooks = function(){
                $scope.checked="checked";
                $http.get('/api/books')
                    .success(function(data){
                        $scope.books = data ;  
                })
                    .error(function(data){
                    console.log('Error:'+ data);
                });

            };

            $scope.deleteBook = function(id){
                $http.delete('/api/book/'+id)
                    .success(function(data){
                        $scope.message = data.message
                        $scope.showBooks();

                });
            };



        }]); 


        //////////////////////////////////////////////////////////////////
        myapp.directive("searchForm",function(){
             return {
               restrict: 'E',
               templateUrl: '../directives/searchForm.html',


           } 
        });

        myapp.directive("addForm",function(){
             return {
               restrict: 'E',
               templateUrl: '../directives/addForm.html',


           } 
        });

        myapp.directive("showForm", function(){
            return{
                restrict: 'E',
                templateUrl: '../directives/showForm.html'
            }
        });


        myapp.directive("returnForm", function(){
            return{
                restrict: 'E',
                templateUrl: '../directives/returnForm.html'
            }
        });

        myapp.directive("rentForm", function(){
            return{
                restrict: 'E',
                templateUrl: '../directives/rentForm.html'
            }
        });

        //////////////////////////////////////////////////////

