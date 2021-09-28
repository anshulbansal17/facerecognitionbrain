const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const postgres = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "postgres",
    password: "sql",
    database: "smart-brain-db",
  },
});

console.log(postgres.select("*").from('users'));

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "Anshul Bansal",
      email: "a",
      password: "a",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1234",
      name: "Aatmic Tiwari",
      email: "aatmic@gmail.com@",
      password: "taatmic",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// midleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // res.send("this is working");
  console.log("this.is working");
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  const new_user = req.body;
  console.log("Getting sign in requrest from client-side", new_user);
  let isFound = false;
  database.users.forEach((user) => {
    if (user.email === new_user.email && user.password === new_user.password) {
      isFound = true;
      return res.json(user);
    }
  });
  if (!isFound) res.status(400).json("error logging in!");
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  // bcrypt.hash(password, null, null, (err, hash) => {
  //     console.log(hash);
  // })
  database.users.push({
    id: "12345",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let isFound = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      isFound = true;
      return res.json(user);
    }
  });
  if (isFound == false) res.status(404).json("no such user");
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log("image ", id);
  let isFound = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      isFound = true;
      user.entries++;
      console.log(user.entries);
      return res.json(user.entries);
    }
  });
  if (isFound == false) res.status(404).json("no such user");
});

app.listen(3000, () => {
  console.log("FaceRecog is Running on Port3000");
});

/* EndPoints

/                 --> res = this is working
/signin           --> POST = success/fail
{here we do post because we dont want our pass to be exposed in query string}
/register         --> POST = return user
/profile/:userid  --> GET = user
/image            --> PUT(update) = return the user
*/
