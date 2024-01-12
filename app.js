//jshint esversion:6
require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require("express");
const bodyParser = require("body-parser");
 const ejs = require("ejs");
const pg = require("pg");
const app = express();
const md5 = require("crypto-js/md5");

const saltRounds = 10;

 const db =new pg.Client({
   user: 'postgres',
   host:'localhost',
   database: 'user',
   password:'zhyaana',
   port: 5432
 });

 db.connect();

 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({extended:true}));



app.get("/", function(req,res){
res.render("home");
})

app.get("/login", function(req,res){
res.render("login");
})
app.get("/register", function(req,res){
res.render("register");
})
app.get("/secrets", function(req,res){
res.render("secrets");
})

app.post("/register" ,async (req , res)=>{

   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
   const email = req.body.username;
   const password=hash;
   console.log();
   try {
   db.query("INSERT INTO users (email,password) VALUES ($1,$2)",[email,password]);
   res.render("secrets")
} catch (error) {
   console.log(error);
}
});
  });


app.post("/login" , async(req,res)=>{
   const email = req.body.username;
   const password=req.body.password;
  
   try {
      const response = await db.query("SELECT * FROM users WHERE email=$1" , [email]);
      const hashPassword = response.rows[0].password;
      bcrypt.compare(password, hashPassword, function(err, result) {
         if(result == true){
            res.render("secrets");
         }
         else{
            console.log(err);
         }
     });
    
   } catch (error) {
      console.log(error);
   }
})

 app.listen(3000 , function(){
    console.log("Server running on port 30000")
 })