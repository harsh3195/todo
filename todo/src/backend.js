const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors =require("cors");


const SALT = 4; //secret
//DB
const db = mongoose.createConnection("mongodb://localhost:27017/todoAppDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = mongoose.Schema({
  task: String,
  timestamp: Date,
  done: Boolean,
  userId: mongoose.Schema.Types.ObjectId,
});

const todoModel = db.model("Todo", todoSchema);

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
});
const userModel = db.model("User", UserSchema);

const isNullOrUndefined = (val) => val === null || val === undefined;

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: 'asdfakldfsdjf',
  resave: false,
  saveUninitialized: true,
}))// available req.session

app.use(express.json());

//Auth

const AuthMiddleware = async (req, res, next) => {
  console.log("request session: ",req.session)
  if (isNullOrUndefined(req.session)||isNullOrUndefined(req.session.userId)) {

    res.status(401).send({err:"not logged in"});
  } else {
    const user =  await userModel.findById(req.session.userId);
    if(isNullOrUndefined(user)){
      res.status(401).send({err:"Not logged in"})
    }
    else{
        req.user = user;
        next();
    }
  }
};

app.get("/logout",AuthMiddleware,(req,res)=>{
  req.session.destroy();
  res.sendStatus(200)
})

//Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (isNullOrUndefined(username) || isNullOrUndefined(password)) {
    res.sendStatus(400);
  } else {
    const hashPwd = bcrypt.hashSync(password, SALT);
    const newUser = userModel({
      username,
      password:hashPwd,
    });
    await newUser.save();
    req.session.userId = newUser._id;
    res.sendStatus(201);
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (isNullOrUndefined(username) || isNullOrUndefined(password)) {
    res.status(400).send({err:"username or password cannot be blank"});
  } else {
    const user =  await userModel.findOne({username:username});
    if(isNullOrUndefined(user)){
      res.status(400).send({err:"Username does not exist"})
    }
    else{
      console.log("user: ",user);
      const match = bcrypt.compareSync(password,user.password);
      if(match){
        req.session.userId = user._id;
        console.log("session: ",req.session);
        res.sendStatus(200);
      }else{
        res.status(400).send("password incorrect!")
      }
    }
  }
});

app.post("/todo",AuthMiddleware,async (req,res)=>{
  const newTodo = req.body;
  newTodo.timestamp=new Date();
  newTodo.done=false;
  newTodo.userId =  req.user._id;
  const unsavedNewTodo = todoModel(newTodo);
  savedTodo = await unsavedNewTodo.save();
  res.send(201);

})


app.get("/todo",AuthMiddleware,async (req,res)=>{
  const todos  = await todoModel.find({
    userId:req.user._id
  })
  res.send(todos);
})

app.get("/userinfo",AuthMiddleware,async (req,res)=>{
  const user = await userModel.findById(req.session.userId);
    res.send({ userName : user.username });
})


app.listen(9999);




