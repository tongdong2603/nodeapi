const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoClient = require("mongoose");

// setup connect to mongoDB
mongoClient
  .connect("mongodb://localhost/nodeapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch(error =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

const app = express();

const userRouter = require("./routes/user");
const deckRouter = require("./routes/deck");

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

// Routes
app.use("/users", userRouter);
app.use("/decks", deckRouter);

// Test server
app.use("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is Ok!"
  });
});

// Catch 404
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //respone to client
  return res.status(status).json({
    error: {
      message: error.message
    }
  });
});

// Start the Server
const port = app.get("port") || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
