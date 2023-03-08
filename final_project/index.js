const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Set up the authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is authenticated
    if (req.session.authorization) {
      // Retrieve the access token from the session
      let token = req.session.authorization.accessToken;
      // Verify the access token
      jwt.verify(token, 'access', (err, user) => {
        if (!err) {
          req.user = user;
          next(); // User is authenticated, proceed to the next middleware
        } else {
          return res.status(403).json({ message: "User not authenticated" });
        }
      });
    } else {
      return res.status(403).json({ message: "User not logged in" });
    }
  });
  
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
