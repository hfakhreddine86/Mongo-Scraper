// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Saved = require("./models/Saved.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

var path = require("path");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

var port = process.env.PORT || 3000;

// Database configuration with mongoose
var databaseUri = "mongodb://localhost/mongoScraper";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Routes
app.post("/saved:id", function (req, res) {

  var newSaved = new Saved(req.body);
  newSaved.save(function (error, doc) {
    if (error) {
      console.log(error);
    } else {

      Article.findOneAndUpdate({
          "_id": req.params.id
        }, {
          "saved": true
        })
        .exec(function (err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.send(doc);
          }
        });
    }
  });

});


// A GET request to scrape the article factory website
app.get("/scrape", function (req, res) {

  request("http://www.articlesfactory.com/articles/technology.html", function (error, response, html) {
    var $ = cheerio.load(html);
    $("div.txt-main").each(function (i, element) {

      var result = {};

      result.title = $(this).children().children().children("a.h2-center").text();
      result.body = $(this).children().children().children().children().children("div").text();
      result.link = $(this).children().children().children("a.h2-center").attr("href");
      result.saved = false;

      var entry = new Article(result);

      entry.save(function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
    res.send("test");
  });
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {

  Article.find({}, function (error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

//Grab all saved articles
app.get("/saved", function (req, res) {

  Article.find({
    "saved": true
  }, function (error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/savedArticles/:id", function (req, res) {
  console.log("Req.params.id: " + req.params.id);

  Article.findOne({
      "_id": req.params.id
    })
    .populate("note")
    .exec(function (error, doc) {
      if (error) {
        console.log(error);
      } else {
        res.json(doc);
      }
    });
});

// Create a new note or replace an existing note
app.post("/savedArticles/:id", function (req, res) {

  var newNote = new Note(req.body);
  newNote.save(function (error, doc) {
    if (error) {
      console.log(error);
    } else {

      // Use the article id to find and update it's note
      Article.findOneAndUpdate({
          "_id": req.params.id
        }, {
          "note": doc._id
        })
        .exec(function (err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.send(doc);
          }
        });
    }
  });
});

app.get("/savedArticles", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/savedArticles.html"));
});

// Listen on port 3000
app.listen(port, function () {
  console.log("App running on port 3000 !");
});