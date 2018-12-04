const User = require("../models/user");
const Patient = require("../models/patient");

exports.countObjects = async (req, res, next) => {

  countedUser = await User.find().countDocuments();
  countedPatient = await Patient.find().countDocuments();
  countedReport = 0;

 countData = {
   countUser: countedUser,
   countPatient: countedPatient,
   countReport: countedReport
 }
  res.status(200).json({
   countData: countData
  });

}
