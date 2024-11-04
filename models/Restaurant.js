/* 
This file defines the schemas to be used in the App

- Defines OperationSchema which has day, open and close attributes
- Defines ResterauntSchema which has name, distance, estimatedPickupTime, 
  address, operationHouse and dashPassEnabled atttributes
*/

//Require the Schema library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const operationSchema = new Schema({
    day: {
        type: String, 
        required: true
    },
    open: String, 
    close: String
})

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    distance: Number,
    estimatedPickupTime: Number,
    address: {
        type: String, 
        required: true
    },
    operationHouse: [operationSchema],
    dashpassEnabled: Boolean
})

//RestaurantSchema is imported as "Restaurant"
module.exports = mongoose.model("Restaurant", RestaurantSchema);