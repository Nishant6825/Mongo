const { MongoClient } = require("mongodb");
let express = require("express");
let app = express();

const MongoUrl = "mongodb://localhost:27017/";
const database = "TestDatabase";
const collection = "Users";

let DATABASE;

let client = new MongoClient(MongoUrl);



app.listen(3000, async() => {

    let rresult = await client.connect();
    DATABASE = rresult.db(database);
    console.log('Connected to database')
})


app.get("/users", async (req, res) => {
  
let col = DATABASE.collection(collection);
let response = await col.find({}).toArray();
console.log(response);
res.json(response);
});
