const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    unique: true,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  saved: {
    type: Boolean,
    default: false
  }, 
  dateWritten: {
      type: String,
    required: true
  }
}, {
  timestamps: true
})


// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;