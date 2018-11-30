const Patient = require("../models/patient");

exports.createPatient = async (req, res, next) => {

  const patient = new Patient({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement,
    congregation: req.body.congregation,
    mobileElder1: req.body.mobileElder1,
    mobileElder2: req.body.mobileElder2,
    phoneElder1: req.body.phoneElder1,
    phoneElder2: req.body.phoneElder2,
    caseDescription: req.body.caseDescription,
    hospital: req.body.hospital,
    hospitalizationDate: req.body.hospitalizationDate,
    medicalRelease: req.body.medicalRelease,
    accommodation: req.body.accommodation,
    infoWho: req.body.infoWho

  });

//
  savedPatient = await patient.save();
  res.status(201).json({
    message: "Patient created!",
    patient: savedPatient
  });

}




exports.updatePatient = async (req, res, next) => {

  const patient = new Patient({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement,
    congregation: req.body.congregation,
    mobileElder1: req.body.mobileElder1,
    mobileElder2: req.body.mobileElder2,
    phoneElder1: req.body.phoneElder1,
    phoneElder2: req.body.phoneElder2,
    caseDescription: req.body.caseDescription,
    hospital: req.body.hospital,
    hospitalizationDate: req.body.hospitalizationDate,
    medicalRelease: req.body.medicalRelease,
    accommodation: req.body.accommodation,
    infoWho: req.body.infoWho
  });

  updatedPatient = await Patient.updateOne( {_id: req.params.id}, patient);

  if (updatedPatient.n > 0) {
    res.status(200).json({
      message: "Update successful!",
      obj: updatedPatient
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getPatients = async (req, res, next) => {

  const fetchedPatients = await Patient.find();
                                      //  .populate('hospital')
                                      //  .populate('accommodation')
                                      //  .exec();

  res.status(200).json({
    message: "Patients fetched successfully!",
    patients: fetchedPatients
  });

}



exports.getOnePatient = async (req, res, next) => {

  const fetchedPatient = await Patient.findById({_id: req.params.id});

  res.status(200).json({
    message: "Patient fetched successfully!",
    patient: fetchedPatient
  });

}




exports.deletePatient = async(req, res, next) => {

  deletedPatient = await Patient.deleteOne({
       _id: req.params.id
    })

      if (deletedPatient.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }


};
