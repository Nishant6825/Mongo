const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const jwt = require('jsonwebtoken');
const {verifyTokenMiddleware} = require('./middleware/verifytoken')
const cors = require('cors')

const app = express();
dotenv.config();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors())

const PORT = process.env.PORT || 3000; // Add a default fallback for the port
const MONGOURL = process.env.MONGOURL || "mongodb://localhost:27017"; // Add a fallback for MongoDB URL

app.listen(PORT, () => {
  mongoose
    .connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }) // Ensuring proper options for Mongo connection
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => console.log("Failed to connect", err));
  console.log(`Server running on port ${PORT}`);
});
// Schema should be instantiated with `new`
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true}
  // age: { type: Number, default: 0 },
 
});

const User = mongoose.model("users", userSchema);
console.log('TEst')

app.get("/test", async (req, res) => {
  try {
    const userData = await User.find();
    console.log(userData);
    res.json({ userData }); // Uncommented this to send the response back
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/user", async (req, res) => {
  try {
    const newUser = new User({ name: req.body.name });
    newUser
      .save()
      .then((user) => console.log("New user created:", user))
      .catch((err) => console.error("Failed to create user:", err));

    const userData = await User.find();
    console.log(userData);
    res.json({ userData }); // Uncommented this to send the response back
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update", async (req, res) => {
  const result = await User.findByIdAndUpdate(
    req.body.id, // _id of the document
    { $set: { name: `${req.body.updatedName}` } }, // Update operation
    { new: true } // Return the updated document
  );

  console.log(result);
});

app.post("/delete", async (req, res) => {
  try {
    // Delete the user by _id
    let id = req.body.id;
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      console.log("Deleted user:", deletedUser);
    } else {
      console.log("No user found with that ID");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
});

app.post('/login', async(req, res)=>{
  const {username, password} = req.body;

  console.log(username)

  let isUser = await User.findOne({name: username, password: password});

  if(isUser){
    const token = jwt.sign({ username },  
      process.env.JWT_SECRET_KEY, { 
          expiresIn: 1000000 
      }); 
      console.log('Token', token);
      res.json({username: username,token: token});
  }
  else{
    res.json({Error: 'Invalid Login'})
  }

});

app.post('/home', verifyTokenMiddleware, async(req, res)=>{
    const {user} = req;
    res.json(`Welcome ${(user.name)}`)
});

