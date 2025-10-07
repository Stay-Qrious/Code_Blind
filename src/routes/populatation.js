const express = require("express");
const fs = require("fs");
const path = require("path");
const { QuestionModel } = require("../models/question");
const { RemainingModel } = require("../models/userquestion");
const userAuth = require("../middleware/auth");

const populationRouter = express.Router();

populationRouter.post("/remainingpopulate", userAuth, async (req, res) => {
  try {
    // 1️⃣ Check if RemainingModel is already populated for this user
    const check = await RemainingModel.find({ uid: req.user._id });
    if (check.length !== 0) {
      return res.json({ message: "RemainingModel already populated for this user" });
    }

    // 2️⃣ Check if QuestionModel is empty, if yes populate from leetcode-data.json
    const existingQuestions = await QuestionModel.find({});
    if (existingQuestions.length === 0) {
      const filePath = path.join(__dirname, "../leetcode-data.json");
      const jsonData = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(jsonData);

      if (!parsedData.problems || parsedData.problems.length === 0) {
        throw new Error("No problems found in JSON file");
      }

      const questionsToInsert = parsedData.problems.map((problem) => ({
        questionName: problem.name,
        questionLink: problem.link,
      }));

      await QuestionModel.insertMany(questionsToInsert);
      console.log("QuestionModel populated from JSON");
    }

    // 3️⃣ Populate RemainingModel for the current user
    const questions = await QuestionModel.find({}).select("_id");

    const remainingData = questions.map((q) => ({
      qid: q._id,
      uid: req.user._id,
    }));

    await RemainingModel.insertMany(remainingData);

    res.json({ message: "RemainingModel populated successfully for this user" });
  } catch (e) {
    res.status(500).json({ message: "Error: " + e.message });
  }
});

module.exports = { populationRouter };
