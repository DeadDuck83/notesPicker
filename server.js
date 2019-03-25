const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;

const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// var routes = require("./controllers/catsController.js");

// app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/notesPicker", { useNewUrlParser: true });

// Create all our routes and set up logic within those routes where required.
app.get("/", function (req, res) {
    db.Article.find({}).then(res.render("index"));
});

app.get("/scrape", function (req, res) {
    console.log("scraping");
    // First, we grab the body of the html with axios
    axios.get("https://www.webdesignerdepot.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
        // db.Article.deleteMany({}, function(){});

        // Now, we grab every h2 within an article tag, and do the following:
        $(".article-hp-content").each(function (i, element) {

            // Save an empty result object
            const result = {};

            const image = $(this).children("a");
            const title = $(this).children("div .main-col-post-info").children("div .main-col-post-info-content");

            result.title = title
                .children("h2")
                .children("a")
                .text();

            result.artimage = image
                 .children("img")
                .attr('src');

            result.link = title
                .children("h2")
                .children("a")
                .attr("href");

            result.altinfo = title
                .children("div .hp-excerpt")
                .text().trim();

            db.Article.create(result)
                .then(function (dbArticle) {
                })
                .catch(function (err) {
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Debug the data that comes in
app.get("/debug", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
        });
});
// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

    // Grab every document in the Articles collection
    db.Article.find({})
        .populate("note")
        .then(function (dbArticle) {
            console.log("dbArticle");
            console.log(dbArticle);
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", {dbArticle : dbArticle});
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});