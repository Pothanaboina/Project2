// models.js

const mongoose = require('mongoose');

// Define the schema for your data
const candidateSchema = new mongoose.Schema({
  sno: {
    type:Number
  },
  name:{
type:String
  } ,
  role:{
    type:String
      },
      imageSrc:{
        type:String
      }
});

// Create a model based on the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = {
  Candidate,
};
