const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "alice", password: "p@ss1" },
  { username: "bob", password: "p@ss2" },
  { username: "carol", password: "p@ss3" },
  { username: "dave", password: "p@ss4" },
  { username: "eve", password: "p@ss5" }
];

// let users = []

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for(let user of users){
    if(user.username === username){
      return (user.password === password)
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
    return res.status(400).json({message: `Error: Username or Password not provided`})
  }

  if(authenticatedUser(username,password)){
    const accessToken = jwt.sign(
      {username: username}, "access", {expiresIn: "1h"}
    )

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).json({message: "User successfully logged in"})
  }
  return res.status(401).json({message: "Invalid login credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
