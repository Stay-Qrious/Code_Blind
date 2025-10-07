const express = require("express");
const app = express();
const { connectDB } = require("./config/database.js");
const { authRouter } = require("./routes/auth.js");
app.use(express.json());
const { profileRouter } = require("./routes/profile");
const cookieparser = require("cookie-parser");
const { populationRouter } = require("./routes/populatation.js");

app.use("/", cookieparser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", populationRouter);

connectDB()
  .then(
    app.listen(3000, async () => {
      console.log("stated the server on port 3000");
    })
  )
  .catch((e) => {
    console.log("Got the error: " + e.message);
  });
