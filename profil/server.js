const Post = require("./models/postModel");
const mongoose = require("mongoose");
const app = require("./app");

const { validateToken } = require("./middleware");
//const userController = require("./controllers/userContrtoller");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("db connection succesful");
  });
app.put("/create", validateToken, async (req, res) => {
  try {
    const { userId, name, email, bio } = req.body;
    await Post.findOneAndUpdate(
      { userId },
      { name, email, bio },
      { upsert: true }
    );
    res.status(201).json({ message: "Profile created/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// app.post("/notify/register", async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Check if the user already exists in the profile database
//     const existingProfile = await Post.findOne({ userId: name });

//     if (existingProfile) {
//       return res.status(400).json({ error: "Profile already exists" });
//     }

//     // Create a new profile for the registered user
//     await Profile.create({ userId: name });

//     res.status(201).json({ message: "Profile created successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
app.put("/:userId/edit", validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, bio } = req.body;
    await Post.findOneAndUpdate({ userId }, { name, email, bio });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/notify/register", async (req, res) => {
  try {
    const { name } = req.body;
    await Profile.create({ userId: name });
    res.status(201).json({ message: "Profile created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/:userId/delete", validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    await Post.findOneAndDelete({ userId });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
const port = 3001;
app.listen(port, () => {
  console.log(`server runing on port no ${port}`);
});
