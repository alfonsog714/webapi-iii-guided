const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.path}`);
  next();
}

function gate(req, res, next) {
  const password = req.headers.password;

  if (password && password == "mellon") {
    next();
  } else {
    next(401);
    // res.status(401).json({ you: "Shall not pass!" });
  }
}

// setup global middleware
server.use(logger);
server.use(helmet());
server.use(express.json());

server.get("/free", (req, res) => {
  res.status(200).json({ welcome: "Web 19 Developers!" });
});

server.get("/paid", gate, (req, res) => {
  res.status(200).json({ welcome: "Welcome to the mines of Moria." });
});

server.use("/api/hubs", gate, hubsRouter);

function addName(req, res, next) {
  const name = "Web 19 Developers";

  // add the name to the request
  req.teamName = name;
  next();
}

server.get("/", addName, (req, res) => {
  const nameInsert = req.teamName ? ` ${req.teamName}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use(errorHandler);

function errorHandler(error, req, res, next) {
  console.log(error);
  res.status(401).json({ message: "You shall not pass!" });
}

module.exports = server;
