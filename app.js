//RESTful API Learning

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
const serverPort = 3000;
const dbPort = 27017;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:" + dbPort + "/wikiDB");
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////Requests Targetting All Article/////////////////////////////////////////
app.route("/articles")
// Create GET verb for RESTful API
  .get(async (req, res) => {
    Article.find({}, (err, result) => {
      try {
        res.send(result);
      } catch (err) {
        res.send(err);
      };
    });
  })
  // Create POST verb for RESTful API
  .post(async (req, res) => {
    const titlePost = req.body.title;
    const contentPost = req.body.content;
    const article = new Article({
      title: titlePost,
      content: contentPost
    });
    await article.save((err) => {
      try {
        res.send("Successfully added a new article.")
      } catch (err) {
        res.send(err)
      }
    });
  })
  // Create DELETED verb for RESTful API
  .delete((req, res) => {
    Article.deleteMany({}, async (err) => {
      try {
        res.send("Successfully deleted all articles.")
      } catch (err) {
        res.send(err);
      }
    });
  });

/////////////////////////////////////////Requests Targetting A Specific Article/////////////////////////////////////////

app.route("/articles/:articleTitle")
// Create GET verb for RESTful API
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({
      title: articleTitle
    }, (err, result) => {
      try {
        if (result) {
          res.send(result);
        } else {
          res.send("No articles matching.");
        }
      } catch (err) {
        res.send(err);
      };
    });
  })
  // Create PUT verb for RESTful API
  .put((req, res) => {
    const articleTitle = req.params.articleTitle;
    const putTitle = req.body.title;
    const putContent = req.body.content;
    Article.findOneAndUpdate({
      title: articleTitle
    }, {
      title: putTitle,
      content: putContent
    }, {
      overwrite: true
    }, (err, result) => {
      try {
        if (result) {
          res.send("Successfully Updated(PUT) a " + articleTitle + " title to " + putTitle + " title.");
        } else {
          res.send("Fail to update a " + articleTitle + " title.")
        }
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    });
  })
  // Create PATCH verb for RESTful API
  .patch((req, res) => {
    const articleTitle = req.params.articleTitle;
    const patchTitle = req.body.title;
    const patchContent = req.body.content;
    Article.findOneAndUpdate({
      title: articleTitle
    }, {
      $set: {
        title: patchTitle,
        content: patchContent
      }
    }, (err, result) => {
      try {
        if (result) {
          res.write("Successfully Updated(PATCH) a " + articleTitle + " title.")
          res.send();
        } else {
          res.send("Fail to PATCH.")
        }
      } catch (err) {
        res.send(err);
      }
    });
  })
  // Create DELETE verb for RESTful API
  .delete((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOneAndDelete({
      title: articleTitle
    }, (err, result) => {
      try {
        if (result) {
          res.send("Successfully Deleted a corresponding " + articleTitle + " title.");
        } else {
          res.send("No Matching a " + articleTitle + " title.");
        }
      } catch (err) {
        res.send(err);
      }
    });
  });


app.listen(serverPort, function() {
  console.log("Server started on port " + serverPort);
});
