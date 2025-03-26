const mongoose = require("mongoose");
const DriverSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    vehicle: String,
    license: String,
    password: String,
});
module.exports = mongoose.model("Driver", DriverSchema);
