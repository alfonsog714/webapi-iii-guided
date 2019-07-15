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
    res.status(401).json({ you: "Shall not pass!" });
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

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
