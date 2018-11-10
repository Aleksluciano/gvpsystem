const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
   firstName: { type: String, required: true},
   lastName: { type: String, required: true},
   email: { type: String, required: true, unique: true },
   mobilePhone: { type: String },
   phone: { type: String },
   cep: { type: String },
   state: { type: String },
   city: { type: String },
   neighborhood: { type: String },
   address: { type: String },
   numeral: { type: Number },
   complement: { type: String },
   congregation: { type: String },
   perfil: { type: String },
   region: { type: String },
   password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator, { message: 'O email já existe no sistema!' });

module.exports = mongoose.model("User", userSchema);
