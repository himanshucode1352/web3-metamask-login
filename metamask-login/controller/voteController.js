const Vote = require("../model/voteModel");

const poll = async (req, res) => {
  const { totalCount, email } = req.body;
  console.log("hellooooooooo`11213", req.id); //decoded id from middleware response
  try {
    const existingVoter = await Vote.findOne({ user_id: req.id });
    if (existingVoter) {
      return res.status(400).json({ message: "User already voted" });
    }
    const totalVotes = await Vote.find().select("totalCount");
    const result = await Vote.create({
      totalCount: totalVotes + parseInt(1),
      user_id: req.id,
    });
    res.status(200).json({ result: result, msg: "thank you for giving vote" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { poll };
