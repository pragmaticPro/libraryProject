        var express = require('express');
        var bodyParser = require('body-parser');
        var morgan = require('morgan');
        var mongoose = require('mongoose');
        var config = require('./config.js');
        var Book = require('./app/models/book.js');
        var User = require('./app/models/user.js');
        var jwt =require('jsonwebtoken');
        var superSecret ="secretKey";

        function createToken(user){
            var token = jwt.sign({
                id:user._id,
                username:user.username,
            },superSecret,{
                expiresInMinute:1440
            });
            return token
        };

        mongoose.connect(config.database, function(err){
            if(err) console.log(err);
            else console.log("connected to database");
        });

        var app = express();
        app.set('superSecret', 'secretKey'); 



        app.use(express.static(__dirname+'/public')); 
        app.use(morgan('dev')) 
        app.use(bodyParser.urlencoded({extended:true})); 
        app.use(bodyParser.json());

        var router = express.Router();

        //middleware
        router.use(function(req,res,next){
            console.log('something is happening');
            next();
        });


        //api routes - no authentication required

        //get all books
        router.get('/books',function(req,res){
            Book.find(function(err,books){
                if(err) res.send(err);
                else res.json(books);
            })
        });


           //search via book title
        router.get('/books/book/:title',function(req,res,next){
            Book.find({'title':req.params.title},function(err,book){
                if(err) return next(err);
                if(!book) return res.send({message:"book not found"});
                res.json(book);
            })
        });



        //search via book author
        router.get('/books/:author',function(req,res,next){
            Book.find({'author':req.params.author},function(err,book){
                if(err) return next(err);
                if(!book) return res.send({message:"book not found"});
                res.json(book);
            })
        });


         //search via book subject
        router.get('/books/boo/:subject',function(req,res,next){
            Book.find({'subject':req.params.subject},function(err,book){
                if(err) return next(err);
                if(!book) return  res.send({message:"book not found"});
                res.json(book);
            })
        });

        //register a new user
        router.post('/register',function(req,res){
            var user = new User({
                username: req.body.username,
                email: req.body.email,
                password:req.body.password,
                admin:req.body.admin
            });

            var token = createToken(user);

            user.save(function(err){
                if(err) {
                   res.send(err);
                    return;
                }

                res.json({
                    success:true,
                    message:'user has been created'
                })
        });
        });


        //login existing user 
        router.post('/login', function(req, res) {

          // find the user
          User.findOne({
                email:req.body.email,
                password:req.body.password
          }, function(err, user) {

            if (err) throw err;

            if (!user) {
              res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
            // check if password matches
              if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
              } else {
                      // if user is found and password is right
                // create a token
                  var token = createToken(user);

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });
               // $window.localStorage['token']= token;
              }
            }


          });
        });


        //middleware to verify token
        router.use(function(req,res,next){
            console.log("someone came to our app");
           var token = req.body.token || req.param() || req.headers['x-access-token'];
            console.log("our token"+ token);

            //decode token
            if(token){
                jwt.verify(token,superSecret,function(err,decoded){
                    if(err){
                        return res.json({success:false, message:'failed to authenticate'});
                    }else{
                        req.decoded = decoded ;
                        next();
                    }
                });
            }else{
                //if there is no token 
                    return res.status(403).send({
                        success:false,
                        message:"no token provided "
                    });

            }
        });  

        //api routes    -authentication required for all these routes-
        ///////////////////////////////////////////////////////

        //router.route('/')
        //    .post(function(req,res){
        //     var story = new Story({
        //     creator:req.decoded.id,
        //     content:req.body.content,
        //         
        //    });
        //    story.save(function(err){
        //        if(err){
        //           res.send(err);
        //            return
        //        }else{
        //            res.json({message:"new story created"});
        //        }
        //        
        //    });
        //})  // no semicolon as we are chaining
        ////5. get all stories by particular user
        //// get all stories by a particular user
        //.get(function(req,res){
        //    Story.find({creator:req.decoded.id},function(err,stories){
        //        if(err){
        //            res.send(err);
        //            return;
        //        }else{
        //            res.json(stories);
        //        }
        //    })
        //});


        ////////////////////////////////////////////

            //add a new book
        router.post('/books',function(req,res){
            var book = new Book({
                title: req.body.title,
                author: req.body.author,
                subject: req.body.subject,
                location:req.body.location,
                totalCopies :req.body.totalCopies,
                availableCopies: req.body.availableCopies,
                checked: true

            });
            book.save(function(err){
                if(err){
                    res.send(err);
                    return
                }else{
                    res.json({message:"Book added !"});
                }
            });

        });

        // hire a book
        router.put('/hiredBooks/:book_id',function(req,res){
            Book.findById(req.params.book_id,function(err, book){
                if(err) res.send(err);
                book.hireBookDetails = "Book rented";
                book.hiredCopies.push({'username':req.decoded.username,'returnDate':new Date(new Date().getTime()+(5*24*60*60*1000))});
                book.availableCopies = book.availableCopies-1;
                book.save(function(err){
                    if(err) res.send(err);
                    res.json({message:"I am hired "})
                });

            });
        });

        // get all hired books 
        router.get('/hiredBooks/:hireBookDetails',function(req,res,next){
            Book.find({'hireBookDetails':req.params.hireBookDetails},function(err,hiredbook)    {

        //        if(req.decoded.username === hiredbook.hiredCopies.username){
                     if(err) return next(err);
                     res.json(hiredbook);
        //        }

            })

        });



        //get all books 

        router.get('/books',function(req,res){
            Book.find(function(err,book){
                if(err) res.send(err);
                else res.json(book);
            })
        });


        router.get('/users',function(req,res){
            User.find(function(err,user){
                if(err) res.send(err);
                else res.json(user);
            })
        });


        // delete a user

        router.delete('/user/:user_id',function(req,res){
            User.remove({
                _id:req.params.user_id
            },function(err,user){
                if(err) 
                    res.send(err);
                  res.json({message:"successfully deleted"});  
        });
        });

        //delete a book

        router.delete('/book/:book_id',function(req,res){
            Book.remove({
                _id:req.params.book_id
            },function(err,book){
                if(err) 
                    res.send(err);
                  res.json({message:"successfully deleted"});  
        });
        });



        // get details of one user

        router.get('/user',function(req,res){
            User.find({'username':req.decoded.username},function(err,user){
                if(err) res.send(err);
                res.json(user);
            });
        });


        // change password of one user

        router.put('/user/:password',function(req,res){
            User.find({'username':req.decoded.username},function(err,user){
                if(err) res.send(err);
                user.password = req.params.password;
                res.json({message:"password updated"});

            });
        });



        // add book to user hiring list

        router.put('/user/updateHiringHistory/:book_id',function(req,res){
         Book.findById(req.params.book_id,function(err,book){
              if(err) res.send(err);

            User.findById(req.decoded.id,function(err,user){
                if(err) 
                    res.send(err);
                var len = user.bookHiringHistory.length;
        user.bookHiringHistory.push({
            'title':book.title,
            'author':book.author});
            //'returnDate':book.hiredCopies[len].returnDate});
                 user.save(function(err){
                    if(err) res.send(err);
                      //  res.json({message:"Hiring list successfully updated "});
                        res.send(user);
                });

            });
        });

        });


     router.put('/user/updatePassword/:newPassword/:oldPassword',function(req,res){
           User.findById(req.decoded.id,function(err,user){
               if(err) res.send(err);
               if(user.password===req.params.oldPassword){
                  user.password = req.params.newPassword
                  user.save(function(err){
                      if(err) res.send(err)
                       res.send({message:"password successfully updated"}); 
                  });

                }else{
                   res.send({message:"old password is incorrect"});
               }

           }); 
        });


    //return Book

    router.put('/user/returnBook/:title',function(req,res){


            User.findById(req.decoded.id,function(err,user){
                if(err) res.send(err);
                var len = user.bookHiringHistory.length;
                var currentDate = Date.now();
                for(var i=0; i<len; i++){
                    if(user.bookHiringHistory[i].title === req.params.title) {
                        user.bookHiringHistory[i].status="returned";

                            if(user.bookHiringHistory[i].returnDate <                              Date.now())
                              user.bookHiringHistory[i].penalty =   ((currentDate.getTime()-returnDate.getTime())*2)
                        user.save(function(err){
                        if(err) res.send(err)
                            res.send(user);
                     })

                    }


                };
            });



    });

    router.put('/returnBook/updateStock/:book_id',function(req,res){
          Book.find({'_id':req.params.book_id},function(err, book){
                if(err) res.send(err)
                else{
                     book.availableCopies = book.availableCopies+1;
    //                 book.save(function(err){
    //                    if(err) {
    //                        res.send(err);
    //                        return
    //                    }else{
    //                        res.json({message:"book returned successfully"});
    //                    }
    //                        
    //                    });
                    }

          });



    });


        // get user id
        router.get('/me',function(req,res){
            res.json(req.decoded);

        });




        app.use('/api',router);


        //route to frontend
        app.get('/',function(req,res){
            res.sendfile('public/app/views/landingPage.html')
        });

        app.listen(config.port,function(err){
            if(err) console.log(err);
            else console.log("listening on port"+ config.port);
        });

