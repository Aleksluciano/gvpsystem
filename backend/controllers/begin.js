const User = require("../models/user");
const Patient = require("../models/patient");

exports.countObjects = async (req, res, next) => {

  countedUser = await User.find().count();
  countedPatient = await Patient.find().count();
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
