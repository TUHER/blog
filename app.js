let express = require('express');
let app = express();
let mongoose = require("mongoose")

const PORT = process.env.PORT || 3000;
let path = require("path");
let Post = require("./models/postModel");
let methodOverride = require("method-override");
const base = 'mongodb+srv://TUHER:12345@cluster0.m7qj4g9.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(base)
.then((res)=>console.log("connected to Mongodb"))
.catch((error)=>console.log(error));


let createPath = (page) => path.join(__dirname,"views", `${page}.html`);
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

app.get('/', (req, res ) =>{
  res.sendFile(createPath("index"));
 //res.render('index');
});



app.get('/blog',(req,res)=>{
  page_parameters = {title: "blog", page_title: "blog"} 
  res.render("blog",{page_parameters});
})

app.get('/post',(req,res)=>{
  page_parameters = {title: "post", page_title: "post"}
  
  Post.find()
  .then((post)=>res.render("post",{page_parameters,posts:post}))
  .catch((error)=>console.log(error))
})

app.get("/edit-post/:id", (req, res)=>
{
  let id = req.params.id;
  Post.findById(id)
  .then((post)=>
  res.render("edit-post",
   {page_parameters: {title: post.title}, id: post._id, post}))
  .catch((error)=>
  {
    console.log(error);
    res.render("error");
  });
});

app.put("/edit-post/:id", (req, res)=>
{
  let id = req.params.id;
  const {postAuthor, postTitle, postContent } = req.body;
  console.log("Received data:", postAuthor, postTitle, postContent);
  Post.findByIdAndUpdate(id, { postAuthor, postTitle, postContent  })
  .then(()=> res.redirect(`/post`))
  .catch((error)=>{
    console.log(error);
    res.render(createPath("error"));
  })
})
/*
app.get('/post/:posts._id',(req,res)=>{
  page_parameters = {title: "post", page_title: "post"}
  
  Post.findById(req.params.posts._id)
  .then((post)=>res.render("post",{page_parameters,posts:post}))
  .catch((error)=>console.log(error))
})
*/
app.delete("/post/:id", (req, res) =>
{
  let id = req.params.id;
  
  Post.findByIdAndDelete(id)
  .then((post)=> res.render("post", {title: "Post", post}))
  .catch((error)=>{
    console.log(error);
    res.render("error");
  });
});




/*
app.get('/about', (req, res)=>{
  res.render('about', {title: 'About',
  content: "lol",
});
})

app.get('/contacts', (req, res)=>{
  res.render('test', {title: 'Contacts'});
})
*/
app.listen(PORT, ()=>{
  console.log('Server has been run on PORT')
});