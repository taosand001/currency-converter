const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
console.log(__dirname);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening to port ${port}`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/quote"));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
