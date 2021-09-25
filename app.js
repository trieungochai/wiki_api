const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("Article", articleSchema);

// Requests Targeting all Articles

app
  .route("/articles")
  .get(function (req, res) {
    // GET (Fetch) all the articles
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);

    // save this into our MongoDB
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        console.log("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    // DELETE all the articles
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all the articles!");
      } else {
        res.send(err);
      }
    });
  });

// Request Targeting a Specific Articles
app.route("/articles/:articleTitle").get(function (req, res) {
  // GET a Specific Article
  Article.findOne(
    { title: req.params.articleTitle },
    function (err, foundTitle) {
      if (foundTitle) {
        res.send(foundTitle);
      } else {
        res.send("No articles matching that title was found!");
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000!");
});
