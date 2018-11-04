const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const congregationSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true},
});

congregationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Congregation", congregationSchema);
