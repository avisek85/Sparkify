const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Matches = require("../models/Matches");
const Profile = require("../models/Profile");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const matches = await Matches.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2");

    // console.log("matches ",matches);

    if (matches.length === 0) {
      return res.status(404).json({ message: "Matches not found" });
    }

    const filteredMatches = matches.map((match) => {
      // Check if user1 is our user
      if (match.user1._id.toString() === userId) {
        return {
          _id: match._id,
          user: match.user2, // Populate the other user (user2)
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
          // Add other fields from the match if needed
        };
      } else {
        // If user2 is our user, populate user1 as the other user
        return {
          _id: match._id,
          user: match.user1, // Populate the other user (user1)
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
          // Add other fields from the match if needed
        };
      }
    });

    res.status(200).json(filteredMatches);
  } catch (error) {
    console.error("Error fetching matches: ", error);
    res.status(500).json({ message: "Error fetching matches", error });
  }
});

module.exports = router;
