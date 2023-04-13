require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Web3 = require("web3");
const connection = require("./db");
const userRoutes = require("./routes/userRoutes");
const voteRoutes = require("./routes/voteRoutes");
const web3 = new Web3("https://cloudfare-eth.com");
//connection to database
connection();

//MIDDLEWARES
app.use(express.json());
app.use(cors());

//metamask
app.get("/nonce", (req, res) => {
  const nonce = new Date().getTime();
  const address = req.params.address;
});
//routes
app.use("/user", userRoutes);
app.use("/vote", voteRoutes);

const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
