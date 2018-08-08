// Headline model

// mongoose
var mongoose = require("mongoose");

// mongoose schema
var Schema = mongoose.Schema;

// Create the headlineSchema
var headlineSchema = new Schema({
  
  headline: {
    type: String,
    required: true,
    unique: true
  },
  
  summary: {
    type: String,
    required: true
  },
 
  url: {
    type: String,
    required: true
  },
  
  date: String,
  saved: {
    type: Boolean,
    default: false
  }
});

var Headline = mongoose.model("Headline", headlineSchema);

// Export 
module.exports = Headline;
