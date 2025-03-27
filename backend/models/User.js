const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    gender: String,
    address: String,
    password: String, // hashed
    authProvider: String,
});
module.exports = mongoose.model("User", UserSchema);
