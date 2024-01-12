//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
 const ejs = require("ejs");
const pg = require("pg");
const app = express();
const md5 = require("crypto-js/md5");

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

   const email = req.body.username;
   const password=md5(req.body.password);
   console.log();
try {
  await db.query("INSERT INTO users (email,password) VALUES ($1,$2)",[email,password]);
   res.render("secrets")
} catch (error) {
   console.log(error);
}
});

app.post("/login" , async(req,res)=>{
   const email = req.body.username;
   const password=md5(req.body.password);
   
   try {
      const result = await db.query("SELECT * FROM users WHERE email=$1 AND password=$2" , [email,password]);
      if( result.rowCount === 1){
         res.render("secrets");
      }
   } catch (error) {
      console.log(error);
   }
})

 app.listen(3000 , function(){
    console.log("Server running on port 30000")
 })