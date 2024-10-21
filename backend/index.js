const express = require("express");
const connect = require("./dbconfig/dbconfig");
const app = express();
const PORT = 3000;
const cors = require('cors');


require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

const UserApi = require("./api/User/UserApi");
const FamilyTreeAPI = require("./api/FamilyTree/FamilyTreeAPI");
const UpdateUser = require('./api/User/UpdateUser')
const UserInfoAPI = require('./api/User/UserInfoAPI')
const FetchFamilyTree = require('./api/FamilyTree/FetchFamilyTree')
const AddEvent = require('./api/FamilyTree/AddEvent')
const FetchTreeById = require('./api/FamilyTree/FetchTreeById')
const JoinCode = require('./api/User/JoinCode')
const FetchJoinTree = require('./api/FamilyTree/FetchJoinTree')


connect();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hii");
});

app.post("/user", UserApi);
app.post("/updateuser", UpdateUser);
app.post("/userinfoapi", UserInfoAPI);
app.post("/joincode", JoinCode);



app.post("/familytree", FamilyTreeAPI);
app.post("/fetchfamilytree", FetchFamilyTree);
app.post("/addevent", AddEvent);
app.post("/fetchtreebyid", FetchTreeById);
app.post("/fetchjointree", FetchJoinTree);



app.listen(PORT, () => {
  console.log("Server Runing on PORT", PORT);
});
