//init code
require('dotenv').config();
const mongoose=require('mongoose');
const assert=require('assert');
const db_url=process.env.DB_URL;

//connection code
mongoose.connect(
    db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex : true,
        useFindAndModify : false
    },
    (error,link)=>{
    //check error
        assert.equal(error,null,'DB connect fail...')
        //ok
        console.log('DB Connect Success...');
       // console.log(link);
        
    }
)