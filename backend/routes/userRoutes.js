const express = require("express");
const auth = require("../middleware/auth.middleware");
const Swipe = require("../models/Swipe");
const Matches = require("../models/Matches");
const User = require("../models/User");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ message: "Unauthorized user" });
    }

    // Fetch the swipe document for the current user
    const userSwipes = await Swipe.findOne({ user: userId });

    // Extract the IDs of users who have been swiped on (any action taken)
    const swipedUserIds = userSwipes
      ? userSwipes.actions.map((action) => action.targetUserId)
      : [];

    const allData = await User.find({
        _id: { $ne: userId, $nin: swipedUserIds },
      });
    // console.log(allData);
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching profiles: ", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/find", async (req, res) => {
  const { searchKeyword } = req.body;
  if (!searchKeyword) {
    return res.status(411).json({ message: "No search keyword present" });
  }
  try {
    console.log("SearchKeyword is ", searchKeyword);

    const userId = req.user?.id;
    const allData = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      name: { $regex: searchKeyword, $options: "i" }, // Case-insensitive search
    });

    res.status(202).json(allData);
  } catch (error) {
    console.error("Error Searching profiles: ", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/swipe", async (req, res) => {
  const { match, action } = req.body;
  const userId = req.user?.id;
  console.log("userId , match , action", userId, match, action);
  if (action != "like" && action != "dislike") {
    return res
      .status(411)
      .json({ message: `Action must be "like" or "dislike" ` });
  }
  try {
    let swipeDoc = await Swipe.findOne({ user: userId });

    if (!swipeDoc) {
      swipeDoc = await Swipe.create({
        user: userId,
        actions: [{ targetUserId: match, action }],
      });
    } else {
      // Check if the target user was already swiped
      const alreadySwiped = swipeDoc.actions.find(
        (item) => item.targetUserId.toString() === match
      );

      if (!alreadySwiped) {
        // Add the new swipe action
        swipeDoc.actions.push({ targetUserId: match, action });
        await swipeDoc.save();
      } else {
        // If already swiped, skip further processing
        return res.status(200).send({ message: "Action already recorded" });
      }
    }

    if (action === "like") {
      const targetSwipeDoc = await Swipe.findOne({ user: match });

      if (
        targetSwipeDoc &&
        targetSwipeDoc.actions.some(
          (item) =>
            item.targetUserId.toString() === userId && item.action === "like"
        )
      ) {
        // Check if a match already exists
        const existingMatch = await Matches.findOne({
          $or: [
            { user1: userId, user2: match },
            { user1: match, user2: userId },
          ],
        });

        if (!existingMatch) {
          await Matches.create({ user1: userId, user2: match });
        }
      }
    }

    res.status(200).send({ message: "Swipe recorded successfully" });
  } catch (error) {
    console.error("Error recording swipe:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { ageRange, gender, interest, lookingFor } = req.body;

    const query = {};

    if (ageRange) {
      query["age"] = { $gte: ageRange[0], $lte: ageRange[1] };
    }

    if (gender) {
      query["gender"] = gender;
    }

    if (interest && interest.length > 0) {
      query["interest"] = { $in: interest };
    }

    if (lookingFor) {
      query["lookingFor"] = lookingFor;
    }
    console.log("query is ", query);

    const matchingProfiles = await User.find(query);

    console.log(matchingProfiles);

    res.status(202).json(matchingProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching profiles");
  }
});

module.exports = router;
