

//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

// Install mongoose and require
const mongoose = require("mongoose")


// Connect a new database 
mongoose.connect("mongodb+srv://admin-nicolas:"+process.env.PASSWORD_DB+"@cluster0.ghiv3.mongodb.net/blogDB",{useNewUrlParser:true, useUnifiedTopology: true });


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// create a post schema
const postSchema = {
  title: String,
  content: String
};

// create post model
const Post = mongoose.model("Post", postSchema)

app.get("/", function(req, res){

  // look for all posts under posts collections in
  // mongodb database!
  Post.find({}, function(err, foundPosts){
    if(!err){
      console.log("Succesfully found posts!!")
    }else{
      console.log("Check code!!")
    }

    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    })
    
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/secretLocationWrite", function(req, res){
  res.render("compose");
});

app.get("/secretLocationDelete", (req,res)=>{
  res.render("delete");
})

app.get("/login", (req, res)=>{
  res.render("login");
})

app.get("/error", (req,res)=>{
  res.render("error");
})

app.post("/error", (req,res)=>{
  res.redirect("/");
}) 

app.post("/login", (req,res)=>{
  
  const {username,password,button}=req.body;

  console.log(req.body);

  // check password
  if(username === process.env.USERNAME && password === process.env.PASSWORD){
    if(button === "delete")
      res.redirect("/secretLocationDelete")
    else if(button === "write")
      res.redirect("/secretLocationWrite");
  }else{
    res.redirect("/error");
  }

})

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  post.save(function(err){
    if(!err){
      console.log("Succesfully saved entry into mongodb database!")
      res.redirect("/");
    }else{
      console.log("Error, check code, couldn't save entry!")
    }
  });

});

app.post("/delete", (req,res)=>{
  const blogPostTitle = req.body.postTitle

  Post.deleteOne({title:blogPostTitle}, err =>{
    if(!err){
      console.log(blogPostTitle + " blog entry was succesfully deleted")
      res.redirect("/");
    }
  })
})

app.get("/posts/:postID", function(req, res){

  // Either render the page using the ID (_id) or
  // the title!

  /// ID
  const ID = req.params.postID

  Post.findById(ID, function(err, post){
      if(!err){
        console.log("Succefully found title, rendering post!");
        res.render("post", {
          title: post.title,
          content: post.content
        })
      }
      else{
        console.log("check code, ERROR")
      }
  })

});



// MADE TO WORK BOTH LOCALLY (PORT 3000) AND REMOTELY
// VIA HEROKU!!!

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started succesfully");
});