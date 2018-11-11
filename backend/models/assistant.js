const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const assistantSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true},
   hospitals: { type: [String]},
   mobilePhone: { type: String },
   phone: { type: String }
});

assistantSchema.plugin(uniqueValidator, { message: 'O nome já existe no sistema!' });

module.exports = mongoose.model("Assistant", assistantSchema);
