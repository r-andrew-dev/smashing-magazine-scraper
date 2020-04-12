// setting up dependencies 
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const mongoose = require('mongoose')
const logger = require('morgan')
const port = process.env.PORT || 8080;

const db = require('./models');

const app = express()

// setting up middleware 
app.use(logger('dev'));
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// // database connection options
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

// connecting to database

mongoose.connect(
        MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`)
    })

app.get('/scrape', function (req, res) {

    axios.get("https://www.smashingmagazine.com/articles/").then(function (response) {

        const $ = cheerio.load(response.data);


        $('article.article--post').each(function (i, elem) {

            const result = {}

            result.title = $(this).find("h1").text();
            result.link = `https://www.smashingmagazine.com${$(this)
                        .find('h1').find('a').attr('href')}`;
            result.summary = $(this).find('p').text();

            if (!result.title || !result.link || !result.summary) {
                console.log('error')
            } else {

                console.log(result)

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle)
                    }).catch(function (err) {
                        console.log(err)
                    })
            }

        });

    });

});


// Route for getting all articles from the database.
app.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({saved: true})
        .populate('Comment')
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Simple home page route
app.get('/', function (req, res) {
    res.sendFile(path.join(`${__dirname} ./public/index.html`))
})


app.listen(port, () => console.log(`Listening on port ${port}`))