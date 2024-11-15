const express = require('express');
const { loginFunction, registerFunction } = require('../controller/auth.controller');
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({storage});

const router = express.Router();

router.post('/login',loginFunction);
router.post('/register',upload.single("profilePicture"),registerFunction);

module.exports = router;