const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.send({ success: false, message: "Admin not found" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
        return res.send({ success: false, message: "Invalid password" });
    const token = jwt.sign({ id: admin._id, role: "admin" }, "ADMIN_SECRET");
    res.send({ success: true, token, admin });
});

module.exports = router;
