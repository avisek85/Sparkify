const User = require("../models/User");
const generateToken = require("../utils/jwt");
const isPasswordCorrect = require("../utils/isPasswordCorect");
const multer = require("multer");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const registerFunction = async (req, res) => {
  //  console.log("req.body is ",req.body);
  const { name, email, password, dob, gender, interest } = req.body;
  // console.log("is intrest is an array", Array.isArray(interest));
  // console.log(req.body);
  if (
    !name ||
    !email ||
    !password ||
    !dob ||
    !gender ||
    !Array.isArray(interest) ||
    interest.length === 0
  ) {
    return res.status(400).json({ message: "All fields required" });
  }
  let profilePictureUrl = "";
  if (req.file) {
    profilePictureUrl = await uploadToCloudinary(
      req.file.buffer,
      "user_profiles"
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      dob,
      gender,
      interest,
      profilePicture: profilePictureUrl,
    });

    const response = await user.save();
    if (response) {
      // const userWithoutPassword = user.toObject();
      // delete userWithoutPassword.password;
      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        // user:userWithoutPassword,
      });
    } else {
      return res
        .status(500)
        .json({ message: "ServerError while registering " });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const loginFunction = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not exist" });
    }
    const check = await isPasswordCorrect(password, user.password);

    if (check) {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      const token = generateToken(user._id);
      return res.status(200).json({ user: userWithoutPassword, token });
    }
    return res.status(400).json({ message: "Password is incorrect" });
  } catch (error) {
    return res.status(500).json({ message: "Error while logging in" });
  }
};

module.exports = {
  loginFunction,
  registerFunction,
};
