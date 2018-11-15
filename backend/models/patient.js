const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const patientSchema = mongoose.Schema({
   firstName: { type: String, required: true},
   lastName: { type: String, required: true},
   email: { type: String },
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
   mobileElder1: { type: String },
   mobileElder2: { type: String },
   phoneElder1: { type: String },
   phoneElder2: { type: String },
   caseDescription: { type: String},
   hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
   hospitalizationDate: { type: Date},
   medicalRelease: { type: Date},
   accommodation: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation", required: true },
   infoWho: { type: String}
});

patientSchema.index({ firstName: 1, lastName: 1}, { unique: true });

patientSchema.plugin(uniqueValidator, { message: 'O paciente já existe no sistema!' });

module.exports = mongoose.model("Patient", patientSchema);
