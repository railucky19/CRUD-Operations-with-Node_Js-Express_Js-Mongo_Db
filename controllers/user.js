//init code
const router=require('express').Router();
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
const User=require('./../models/user');

//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

//routes goes here
//default route
router.all('/',(req,res)=>{
    return res.json({
        status : true,
        message : 'User controller work8ing...'
    });
})

//create new user route


router.post('/createNew',[

    //check not empty field
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
],
(req,res)=>{
    //check validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status : false,
            message : "Form validation error",
            errors : errors.array()
        });
    }
    //hash password code

    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    
    //create new use model
    var temp = new User({
        username : req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    // insert data into database
temp.save((error,result)=>{
    //check error
    if(error){
        return res.json({
            status : false,
            message : "DB Insert fail....",
            error : error
        });
    }
    //everything ok
    return res.json({
        status : true,
        message : "DB Insert Success...",
        result : result

    });
});


});

//find user document route
router.get('/find',(req,res)=>{
    // find user document
    User.findById("5f7719bdc9dbd13a88840665",(error,result)=>{
        // check error
        if(error){
            return res.json({
                status : false,
                message : "DB Find Fail...",
                error : error

            });
        }
        //if everything ok

        return res.json({
            status : true,
            message : "DB Find Success...",
            result : result
        })
    })
})
//update user document
router.put(
    '/update/:email',(req,res)=>{

 // check email is empty or not
 if(req.params.email){
      //Update User document
       
      User.findOneAndUpdate(
        {email :req.params.email },
        {username : 'Gourav Rai'},
        (error,result)=>{
            //check error

            if(error){
                return res.json({
                    status : false,
                    message : "DB Update failed...",
                    error : error
                })
            }
            // if everything ok

            return res.json({
                status : true,
                message : "DB update Success...",
                result : result
            })
        }
    );
 } else{
     return res.json({
         status : "false",
         message : "Email is not provided..."
     })
 }
       
    }
)
// remove user dcument
router.delete(
    '/delete/:email',(req,res)=>{
       // check email not empty
       if(req.params.email){
           User.remove(
               { email : req.params.email},
               (error,result)=>{

                   // check error
                   if(error){
                       return res.json({
                           status : false,
                           message : "DB Delete fail...",
                           error : error
                       });
                   }

                   //everything is ok
                   return res.json({
                       status : true,
                       message : "DB Delete Success...",
                       result : result
                   })
               }
           )
       } else {
           return res.json({
               status : false,
               message : "Email not provided"
           })
       }
    }
)
// login router for user
router.post(
    '/login',
    [
        //check not empty field
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
    ],(req,res)=>{

          //check validation errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status : false,
            message : "Form validation error",
            errors : errors.array()
        });
    }
    // check email  exist or not
    User.findOne(
        { email : req.body.email},(error,result)=>{
            // check error
            if(error){
               return res.json({
                   status : false,
                   message : 'DB read fail....',
                   error : error
               })

            }

            //result is empty or not
            if(result){
                //when result variable contains document
                 // match password
                 const isMatch= bcrypt.compareSync(req.body.password,result.password)
                // check password is match
                if(isMatch){
                    //password Match
                    return res.json({
                        status : true,
                        message : "User exists Login Success..",
                        result : result
                    });
                }
             else {
                //password Not Match
                return res.json({
                    status : false,
                    message : "Password not matched Login fail",
                });
            }
        }
                else {
                    //user document don' exist
                    return res.json({
                        status : false,
                        message : 'User don\'t exists'
                    })
                }    
            }
    );
        } 
    );
    

module.exports=router;
