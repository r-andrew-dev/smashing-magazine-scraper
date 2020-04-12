// setting up dependencies 
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const mongoose = require('mongoose')
const logger = require('morgan')
const port = process.env.PORT || 8080;

// const db = require('./models');

const app = express()

// setting up middleware 
app.use(logger('dev'));
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Simple home page route
app.get('/', function (req, res) {
    res.sendFile(path.join(`${__dirname} ./public/index.html`))
})

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
            result.link = `https://www.smashingmagazine.com/${$(this)
                        .find('h1').find('a').attr('href')}`;
            result.summary = $(this).find('p').text();

            if (!title || !link || !summary) {
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

        res.send('scrape complete!')

    });

});


app.listen(port, () => console.log(`Listening on port ${port}`))