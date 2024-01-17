require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const session=require('express-session');
const app=express();
const PORT=process.env.PORT||4000;
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection;
db.on('error',(error)=>{console.log(error);})
db.once('open',()=>{console.log("successfully connected to database")})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view cache', false);
app.set('views', 'views');
app.set('view engine','ejs');
app.use("",require("./routes/routes"))
app.use(express.static(__dirname+'/public'));
app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
})