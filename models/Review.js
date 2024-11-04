/* 
This file defines the schemas to be used in the App

- Defines ReviewSchema which has resterauntId, name, text, rating, helpfulCount, 
  date, and likes attributes
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    restaurantId: String,
    name: String,
    text: String,
    rating: Number,
    helpfulCount: Number,
    date: String,
    likes: Number
})

// ReviewSchema is imported as "Review"
module.exports = mongoose.model("Review", ReviewSchema);
