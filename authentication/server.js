const axios = require("axios");
const User = require("./models/orderModel");
const mongoose = require("mongoose");
const app = require("./app");
const { generateToken } = require("./validate");
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
//app.post("/signups", userController.signup);
//app.post("/login", userController.login);
//app.get("/getalldata", userController.protect, userController.getAllUsers);
app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const newUser = await User.create(req.body);
    // Notify profile service about new user
    await axios.post("http://localhost:3001/notify/register", { name });
    res.status(201).json({
      message: "User registered successfully",
      data: { user: newUser },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(200).json({ message: "please provide  name " });
    }
    const user = await User.findOne({ name });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(200).json({
        messsage: "incorrect email or password",
      });
    }
    const token = generateToken();
    res.status(200).json({
      message: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`server runing on port no ${port}`);
});
