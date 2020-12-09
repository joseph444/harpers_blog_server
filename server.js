const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");

const app = express();

mongoose.connect(config.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
                    .then(res=>console.log("DataBase Connected"))
                    .catch(err=>{
                        console.log(err);
                        process.exit(-1)
                    })


//global middlewares 
app.use(cors())
app.use(bodyParser.json())




app.listen(config.env.PORT,function(){
    console.log(`Running on port ${config.env.PORT}`);
})

