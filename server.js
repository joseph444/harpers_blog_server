const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");
const Middlewares = require("./middlewares");

const app = express();

mongoose.connect(config.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
                    .then(res=>console.log("DataBase Connected"))
                    .catch(err=>{
                        console.log("Error at connect method");
                        console.log(err);
                        process.exit(-1)
                    })


//global middlewares 
app.use(cors())
app.use(bodyParser.json())

// import the routes

const Routes = require("./routes");


//use routes

app.use('/api/auth',Routes.UserRoute);
app.use('/api/profile',Routes.ProfileRoute)
app.use('/api/poem',Routes.PoemRoute);
app.use('/api/story',Routes.StoryRoute);
app.use('/api/post',Routes.PostRoute);
app.use('/api/album',Routes.AlbumRoute);

try {
    //var http = require('http'),https= require('https');
  //  http.createServer(app).listen(5000);
    app.listen(config.env.PORT,function(){
        console.log(`Running on port ${config.env.PORT}`);
    })
} catch (error) {
    console.log("Error at listen method");
    console.log(error);
}

