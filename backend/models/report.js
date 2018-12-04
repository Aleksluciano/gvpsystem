const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
   typeReport: { type: String, required: true },
   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
   assitantId: { type: mongoose.Schema.Types.ObjectId, ref: "Assistant" },
   visitDate: { type: Date},
   gvpId1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
   gvpId2: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
   description: { type: String}
});

// reportSchema.plugin(uniqueValidator, { message: 'O nome já existe no sistema!' });

module.exports = mongoose.model("Report", reportSchema);
