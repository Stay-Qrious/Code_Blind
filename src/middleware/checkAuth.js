const jwt = require("jsonwebtoken");
const { QuestionModel } = require("../models/question");
const { RemainingModel } = require("../models/userquestion");
const { UserModel } = require("../models/user");

const checkAuth = async (req, res, next) => {
  try {
    console.log("hiii");

    const fake = new QuestionModel({
      questionName: "2 sum",
      questionLink: "https://example.com/2sum",
    });
    await fake.save();

    const q = await QuestionModel.findOne({});
    const { token } = req.cookies;

    const { _id } = jwt.verify(token, "Secretkey@123");
    if (!_id) {
      throw new Error("Invalid jwt");
    }

    const user = await UserModel.findById(_id);

    const fake2 = new RemainingModel({
      qid: q._id,
      uid: user._id,
    });
    await fake2.save();

    next();
  } catch (err) {
    console.log("checkAuth error:", err.message);
    res.status(400).json({ message: "checkAuth error: " + err.message });
  }
};

module.exports = checkAuth;
