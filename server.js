const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const articleRouter = require("./routes/articles");
const Article = require("./models/article");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();
dotenv.config();

// const port = process.env.PORT || 5000;

const username = process.env.mongodb_username;
const password = process.env.mongodb_password;

if (!username || !password) {
  console.error(
    "MongoDB username or password not set in environment variables"
  );
  process.exit(1);
}

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster-1.cxgc1yb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.set("views", "./view");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory.
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
  } catch (err) {
    res.status(500).send("Error fetching articles");
  }
});

app.use("/articles", articleRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
