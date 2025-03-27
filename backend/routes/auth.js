const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.send({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hash });
    await user.save();
    res.send({ success: true, message: "Signup successful" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send({ success: false, message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.send({ success: false, message: "Incorrect password" });
    const token = jwt.sign({ id: user._id }, "SECRET");
    res.send({ success: true, token });
});

module.exports = router;
