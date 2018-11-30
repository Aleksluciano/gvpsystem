const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const reportSchema = mongoose.Schema({
   type: { type: String },
   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
   assitantId: { type: mongoose.Schema.Types.ObjectId, ref: "Assistant" },
   visitDate: { type: Date},
   gvpId1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
   gvpId2: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

// reportSchema.plugin(uniqueValidator, { message: 'O nome já existe no sistema!' });

module.exports = mongoose.model("Report", reportSchema);
