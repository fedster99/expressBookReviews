const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username or password not provided' });
    }
    if (isValid(username)) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    users.push({ username, password });
    return res.status(200).json({ message: 'User registered successfully' });
  });
  

// Get the list of books available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json(Object.values(books));
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(b => b.isbn === isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'No books found for the author' });
    }
  
    return res.status(200).json(matchingBooks);
  });
  

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title === title) {
        matchingBooks.push(book);
      }
    }
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'No books found with the given title' });
    }
  
    return res.status(200).json(matchingBooks);
  });
  

// Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(b => b.isbn === isbn);
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  });
  
  
  

module.exports.general = public_users;
