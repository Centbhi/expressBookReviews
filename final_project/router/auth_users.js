const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "alice", password: "p@ss" },
  { username: "bob", password: "p@ss" },
  { username: "carol", password: "p@ss" },
  { username: "dave", password: "p@ss" },
  { username: "eve", password: "p@ss" }
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
  //Write your code hereA
  const isbn = req.params.isbn
  const review = req.body.review
  const user = req.session.authorization?.username

  if(!user){
    return res.status(404).json({message: `User is not logged in`})
  }

  if(!books[isbn]){
    return res.status(404).json({message: `Error: book with ISBN #${isbn} was not found`})
  }

  if(!review){
    return res.status(404).json({message: `Error: No review provided`})
  }

  books[isbn].reviews[user] = review
  return res.status(200).json(books[isbn].reviews);
});

regd_users.delete("/auth/review/:isbn", (req,res) =>{
  const isbn = req.params.isbn
  const user = req.session.authorization?.username

  if(!user){
    return res.status(404).json({message: `User is not logged in`})
  }

  if(!books[isbn]){
    return res.status(404).json({message: `Error: book with ISBN #${isbn} was not found`})
  }

  if(!books[isbn].reviews[user]){
    return res.status(404).json({message: `Error: Review for ISBN #${isbn} by ${user} not found`})
  }
  delete books[isbn].reviews[user]

  return res.status(200).json(books[isbn].reviews);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
