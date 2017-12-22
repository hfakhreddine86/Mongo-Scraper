// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var SavedSchema = new Schema({
  // Just a string
  link: {
    type: String
  },
  // Just a string
  headline: {
    type: String
  }
});

// Create the Note model with the NoteSchema
var Saved = mongoose.model("Saved", SavedSchema);

// Export the Note model
module.exports = Saved;