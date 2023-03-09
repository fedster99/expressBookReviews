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
// public_users.get('/', (req, res) => {
//    return res.status(200).json(Object.values(books));
// });

// task 10 version
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('booksdb.js');
      res.status(200).json(response.data);
    } catch (err) {
      res.status(400).json({ message: 'Something went wrong' });
    }
  });
  

// Get book details based on ISBN
//public_users.get('/isbn/:isbn', (req, res) => {
//    const isbn = req.params.isbn;
//    const book = Object.values(books).find(b => b.isbn === isbn);
//    if (book) {
//     return res.status(200).json(book);
//    } else {
//      return res.status(404).json({ message: 'Book not found' });
//    }
//  });


//task 11 version

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get('booksdb.js')
    .then(function(response){
      const book = response.data.find(b => b.isbn === isbn);
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: 'Book not found' });
      }
    })
    .catch(function(error){
      console.log(error);
    });
  });
  
  
// Get book details based on author
//public_users.get('/author/:author', (req, res) => {
//    const author = req.params.author;
//    const bookKeys = Object.keys(books);
//    const matchingBooks = [];
  
//    for (const key of bookKeys) {
//      const book = books[key];
//      if (book.author === author) {
//        matchingBooks.push(book);
//      }
//    }
  
//    if (matchingBooks.length === 0) {
//      return res.status(404).json({ message: 'No books found for the author' });
//    }
  
//    return res.status(200).json(matchingBooks);
//  });



// TASK 12 - Get book details based on author with async-await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get('booksdb.js');
        const bookKeys = Object.keys(response.data);
        const matchingBooks = [];
    
        for (const key of bookKeys) {
          const book = response.data[key];
          if (book.author === author) {
            matchingBooks.push(book);
          }
        }
    
        if (matchingBooks.length === 0) {
          return res.status(404).json({ message: 'No books found for the author' });
        }
    
        return res.status(200).json(matchingBooks);
    } catch (error) {
        console.log(error);
    }
});
  

// Get all books based on title
//public_users.get('/title/:title', (req, res) => {
//    const title = req.params.title;
//    const bookKeys = Object.keys(books);
//    const matchingBooks = [];
  
//    for (const key of bookKeys) {
//      const book = books[key];
//      if (book.title === title) {
//        matchingBooks.push(book);
//      }
//    }
  
//    if (matchingBooks.length === 0) {
//      return res.status(404).json({ message: 'No books found with the given title' });
 //   }
  
//    return res.status(200).json(matchingBooks);
//  });

// Task 13
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    axios.get('booksdb.js')
    .then(response => {
      const bookKeys = Object.keys(response.data);
      const matchingBooks = [];
  
      for (const key of bookKeys) {
        const book = response.data[key];
        if (book.title === title) {
          matchingBooks.push(book);
        }
      }
  
      if (matchingBooks.length === 0) {
        return res.status(404).json({ message: 'No books found with the given title' });
      }
  
      return res.status(200).json(matchingBooks);
    })
    .catch(error => console.log(error));
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
