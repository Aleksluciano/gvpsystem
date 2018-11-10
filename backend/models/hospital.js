const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const hospitalSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true},
   cep: { type: String },
   state: { type: String },
   city: { type: String },
   neighborhood: { type: String },
   address: { type: String },
   numeral: { type: Number },
   complement: { type: String }
});

hospitalSchema.plugin(uniqueValidator, { message: 'O nome já existe no sistema!' });

module.exports = mongoose.model("Hospital", hospitalSchema);
