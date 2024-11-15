const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const getObjectId = require("../utils/getObjectId");

router.use(auth);
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("profilePicture"), async (req, res) => {
  try {
    let { bio, interest, name, lookingFor } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      // console.log("cant find id");
      return res.status(401).json({ message: "Unauthorized" });
    }
    let profilePictureUrl = "";
    if (req.file) {
      profilePictureUrl = await uploadToCloudinary(
        req.file.buffer,
        "user_profiles"
      );
    }

    if (interest) {
      interest = JSON.parse(interest);
    }

    if (lookingFor) {
      lookingFor = JSON.parse(lookingFor);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          bio: bio || undefined,
          profilePicture: profilePictureUrl || undefined,
          interest:
            Array.isArray(interest) && interest.length > 0
              ? interest
              : undefined,
          name: name || undefined,
          lookingFor:
            Array.isArray(lookingFor) && lookingFor.length > 0
              ? lookingFor
              : undefined,
          // location: location || undefined,
          // isVisible:
          //   isVisible === "true"
          //     ? true
          //     : isVisible === "false"
          //     ? false
          //     : undefined,
        },
      },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let userId = req.query.userId;
    // console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    userId = getObjectId(userId);
    const profile = await User.findById({ _id: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json(profile);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
