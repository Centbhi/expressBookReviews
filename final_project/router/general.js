const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if(books[isbn]){
    return res.status(200).json(books[isbn])
  }else{
    return res.status(404).json({message: `Error: book with ISBN #${isbn} was not found`})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const booksFromAuthor = [];

  for(let isbn in books){
    if(books[isbn].author === author){
      booksFromAuthor.push(books[isbn])
    }
  }
  if(booksFromAuthor.length > 0){
    return res.status(200).json(booksFromAuthor)
  }else{
    return res.status(404).json({message: `Error: no book with Author ${author} was found`})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  const booksFromTitle = [];

  for(let isbn in books){
    if(books[isbn].title === title){
      booksFromTitle.push(books[isbn])
    }
  }
  if(booksFromTitle.length > 0){
    return res.status(200).json(booksFromTitle)
  }else{
    return res.status(404).json({message: `Error: no book with Title ${title} was found`})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if(books[isbn]){
    return res.status(200).json({title: books[isbn].title, reviews: books[isbn].reviews})
  }else{
    return res.status(404).json({message: `Error: book with ISBN #${isbn} was not found`})
  }
});

module.exports.general = public_users;
