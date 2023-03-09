const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// code to check is the username is valid
const isValid = (username)=>{ //returns boolean
    return users.some(u => u.username === username);
}


// code to check if username and password match the one we have in records.
const authenticatedUser = (username,password) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      return false;
    }
    return user.password === password;
  };

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username or password not provided' });
    }
    if (!isValid(username)) {
      return res.status(400).json({ message: 'Username is not valid' });
    }
    if (!authenticatedUser(username, password)) {
      return res.status(400).json({ message: 'Username or password is incorrect' });
    }
  
    // Create the JWT token
    const token = jwt.sign({ username }, process.env.SECRET_KEY);
    return res.status(200).json({ token });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.query.username;
  
    if (!review) {
      return res.status(400).json({ message: 'Review not provided' });
    }
  
    if (!username) {
      return res.status(400).json({ message: 'Username not provided' });
    }
  
    if (!isValid(username)) {
      return res.status(400).json({ message: 'Username not valid' });
    }
  
    for (const key in books) {
      const book = books[key];
      if (book.isbn === isbn) {
        const existingReview = book.reviews.find(r => r.username === username);
        if (existingReview) {
          existingReview.review = review;
          return res.status(200).json({ message: 'Review Updated!' });
        } else {
          book.reviews.push({ username, review });
          return res.status(200).json({ message: 'Review Added!' });
        }
      }
    }
    return res.status(404).json({ message: 'Book not found' });
  });


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.query.username;
  
    if (!username) {
      return res.status(400).json({ message: 'Username not provided' });
    }
  
    if (!isValid(username)) {
      return res.status(400).json({ message: 'Username not valid' });
    }
  
    for (const key in books) {
      const book = books[key];
      if (book.isbn === isbn) {
        const reviewIndex = book.reviews.findIndex(r => r.username === username);
        if (reviewIndex !== -1) {
          book.reviews.splice(reviewIndex, 1);
          return res.status(200).json({ message: 'Review Deleted!' });
        } else {
          return res.status(404).json({ message: 'No reviews found for the user' });
        }
      }
    }
    return res.status(404).json({ message: 'Book not found' });
  });



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
