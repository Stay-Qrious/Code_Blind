const mongoose = require("mongoose");
const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://merausername:merapassword@namaste-tripathi.ovse041.mongodb.net/codeblind"
  );
};

module.exports={connectDB};
