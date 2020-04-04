// setting up dependencies 
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const mongoose = require('mongoose')
const logger = require('morgan')

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

// database connection options
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

// connecting to database
mongoose.connect(MONGODB_URI);

// URL: https://www.nbcnews.com/
// Headline: Inside of div.class="info___1Xmsp pt3 pt0 ph4 info___2M8Ka   h2.span <span class="headline___38PFH">Missing Kennedy family member's husband pens tribute</span>
// Summary: class="articleDek dekSummary___GcgCT
// URLArticle: 

axios.get("https://www.nbcnews.com").then(function(response) {

    const $ = cheerio.load(response.data);
    



