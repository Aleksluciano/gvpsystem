const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const accommodationSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true},
   cep: { type: String },
   state: { type: String },
   city: { type: String },
   neighborhood: { type: String },
   address: { type: String },
   numeral: { type: Number },
   complement: { type: String },
   responsable: { type: String },
   mobilePhone: { type: String },
   phone: { type: String }
});

accommodationSchema.plugin(uniqueValidator, { message: 'O nome já existe no sistema!' });

module.exports = mongoose.model("Accommodation", accommodationSchema);
