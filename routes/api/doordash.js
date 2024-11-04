/*
The file below defines two RestAPI endpoints for managing Restaurant data   

- POST /register/restaurants: Registers a new restaurant.
  - Checks if a restaurant with the given address already exists.
  - If it does, returns a 400 status with an error message.
  - If not, saves the new restaurant and returns it with a 200 status.

- GET /register/restaurants: Retrieves a list of all registered restaurants.
  - Returns a 200 status with the list of restaurants.
  - If an error occurs, returns a 500 status with an error message.
*/

const express = require("express");
const router = express.Router();

// Requires Restaurant and Review schema
const Restaurant = require("../../models/Restaurant");
const Review = require("../../models/Review");
const handleError = require("../../utils/errorHandler");
const ObjectId = require("mongodb").ObjectId;

router.post("/register/restaurant", async (req, res) => {
    try {
        // Checks to see whether restaurant is already in DB. If so, error is sent.
        const existingAddress = req.body.address;
        const existingRestaurant = await Restaurant.findOne({ address: existingAddress });
        if (existingRestaurant) {
            return res.status(400).json({ message: "You cannot register a restaurant with the same address" });
        } else {
            const newRestaurant = new Restaurant(req.body);
            await newRestaurant.save().catch(err => console.log(err));
            return res.status(200).json(newRestaurant);
        }
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.get("/register/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.post('/notes', async (req, res) => {
    const { title, content, subject, userId } = req.body;

    const strUserId = req.body.userId;
    const usersId = new ObjectId(strUserId);
    try {
        // Validate userId format (must be a valid ObjectId)
        if (!ObjectId.isValid(usersId)) {
            return res.status(400).json({ msg: 'Invalid userId format' });
        }

        // Find user by userId in User model
        const user = await User.findById(usersId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Create a new Note instance with validated data
        const newNote = new Note({
            title,
            content,
            subject,
            owner: usersId // Assign userId to new note's owner field
        });

        // Save new note to database
        await newNote.save();

        // Respond with the newly created note
        return res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error.message);
        return res.status(500).json({ msg: 'Server Error' });
    }
});


router.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find().sort({rating : -1});
        console.log(JSON.stringify(reviews[0]));
        return res.status(200).json(reviews);
    } catch (error) {    
        console.log(error);
        handleError(error, res);
    }
});

router.get("/reviews/average/:restaurantId", async (req, res) => {
    try {
        const {restaurantId} = req.params;
        const aggregation = await Review.aggregate([
            {$match: {restaurantId: restaurantId}},
            {$group: { 
                _id: `$restaurantId`,
                totalReviews: {$sum: 1},
                averageRating: {$avg: `$rating`},
                sumRating: {$sum: `$rating`}
            }},
            {$project: {
                totalReviews: 1,
                sumRating: 1,
                averageRating: {$round: [`$averageRating`, 1]},
            }}
        ])

        console.log(aggregation);

        if (aggregation.length === 0) {
            return res.status(404).json({
                restaurantId: restaurantId,
                totalReviews: 0,
                sumRating: 0,
                averageRating: 0        
            })
        }
        return res.status(200).json(aggregation[0]);
    } catch (error) {    
        console.log(error);
        handleError(error, res);
    }
});

router.put("/restaurant/:id", async (req, res) => {
    const {id} = req.params;
    const updatedRestaurantData = req.body;
    const restaurantObjId = new ObjectId(id);

    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantObjId,
            updatedRestaurantData,
            {new: true}
        )
        if (!updatedRestaurant) {
            return res.status(404).json({message: "No restaurant exists to be updated"});
        }
        return res.status(200).json(updatedRestaurant);
    } catch (error) {    
        console.log(error);
        handleError(error, res);
    }
}); 

router.delete("/restaurant/:id", async (req, res) => {
    const {id} = req.params;
    const restaurantObjId = new ObjectId(id);

    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantObjId)
        if (!deletedRestaurant) {
            return res.status(404).json({message: "No restaurant exists to be deleted"});
        }
        return res.status(200).json(deletedRestaurant);
    } catch (error) {    
        console.log(error);
        handleError(error, res);
    }
}); 

module.exports = router;


