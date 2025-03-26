const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, phone, vehicle, license, password } = req.body;
    const existing = await Driver.findOne({ email });
    if (existing) return res.send({ message: "Driver already exists" });
    const hash = await bcrypt.hash(password, 10);
    const driver = new Driver({
        name,
        email,
        phone,
        vehicle,
        license,
        password: hash,
    });
    await driver.save();
    res.send({ success: true, message: "Driver registered" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver)
        return res.send({ success: false, message: "Driver not found" });
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch)
        return res.send({ success: false, message: "Invalid password" });
    const token = jwt.sign({ id: driver._id }, "DRIVER_SECRET");
    res.send({ success: true, token, driver });
});

module.exports = router;
