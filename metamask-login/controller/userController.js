const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider || "https://cloudfare-eth.com");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.ACCESS_TOKEN_SECERT
    );
    res.status(200).json({ user: result, token: token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!matchedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.ACCESS_TOKEN_SECERT
    );
    res.status(200).json({ user: existingUser.email, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getNonce = async (req, res) => {
  // console.log("hyyyyyyyy");
  const nonce = new Date().getTime();
  const address = req.query.address;

  const tempToken = jwt.sign(
    { nonce, address },
    process.env.ACCESS_TOKEN_SECERT,
    {
      expiresIn: "60s",
    }
  );
  const message = getSignMessage(address, nonce);

  return res.json({ tempToken, message });
};

const userVerify = async (req, res) => {
  const authHeader = req.body.headers.authorization;
  const tempToken = authHeader?.split(" ")[1];
  if (tempToken == null) {
    res.status(500);
  }
  // console.log("authHeader", authHeader);
  const userData = jwt.verify(tempToken, process.env.ACCESS_TOKEN_SECERT);
  console.log(userData);
  const message = getSignMessage(userData.address, userData.nonce);
  const signature = req.query.signature;
  console.log("message", message);
  const verifiedAddress = await web3.eth.accounts.recover(message, signature);
  if (verifiedAddress.toLowerCase() == userData.address.toLowerCase()) {
    console.log("doneeeeeeeeeeeeeeeeeeee");
  } else {
    console.log("huaaaaa nhi brooooo");
  }
  console.log("verifiedAddress", verifiedAddress);
};

const getSignMessage = (address, nonce) => {
  return `Please sign this message for address ${address}:and id is ${nonce}`;
};

module.exports = { signUp, signIn, getNonce, userVerify };
