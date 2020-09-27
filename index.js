const metaget = require('metaget');
const express = require("express")
const chalk = require("chalk")
const logger = require('morgan');
var cors = require('cors')
var fs = require('fs');


// var db = require("./config/db")


const app = express()
const port = process.env.PORT || 3000

app.use(logger('dev'));
app.use(cors())



app.use(express.json())
app.use(express.urlencoded({extended : false ,limit : "250m" }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"))


app.post('/',(req,res)=>{

    console.log(req.body)

    fs.writeFile('username.txt', req.body.username, function (err) {
      if (err) throw err;
      res.redirect(200,'/insta')
      console.log('Saved!');
    });

   
    
   
   
})

app.get('/',(req,res)=>{

    console.log(req.body)
    res.render('home');

})


app.get('/insta' ,(req,res)=>{
    console.log(req.body)

    fs.readFile('username.txt', 'utf8',function(err, data) {

       console.log(data);
       const url = `https://www.instagram.com/${data}`;

       metaget.fetch(url, (err, metaResponse) => {
           if(err){
               console.log(err);
           }else{
                  console.log(metaResponse["og:description"])
                  var followers = metaResponse["og:description"].split("Followers")[0]
                  var following = metaResponse["og:description"].split("Following")[0].split(",")[1]
                  var posts = metaResponse["og:description"].split("Posts")[0].split(" ")[4]
                  var name = metaResponse["og:title"].split(" ")[0]
                  console.log(posts)
             var  data = {
                  image : metaResponse["og:image"],
                  url : metaResponse["og:url"],
                  followers : followers,
                  following : following,
                  posts : posts,
                  name : name
              }
              return res.render('insta',data);
           }
       });    
       

      });

    
})




app.listen(port , ()=>{
    console.log(chalk.blue(`Server listening on ${port}`))
})