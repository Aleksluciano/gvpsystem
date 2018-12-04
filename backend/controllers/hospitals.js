const Hospital = require("../models/hospital");

exports.createHospital = async (req, res, next) => {

  const hospital = new Hospital({
    name: req.body.name,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement
  });

  savedHospital = await hospital.save();

  res.status(201).json({
    message: "Hospital created!",
    hospital: savedHospital
  });

}




exports.updateHospital = async (req, res, next) => {

  const hospital = new Hospital({
    _id: req.body.id,
    name: req.body.name,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement
  });

  updatedHospital = await Hospital.updateOne( {_id: req.params.id}, hospital);

  if (updatedHospital.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getHospitals = async (req, res, next) => {

  const fetchedHospitals = await Hospital.find();

  res.status(200).json({
    message: "Hospitals fetched successfully!",
    hospitals: fetchedHospitals
  });

}




exports.deleteHospital = async(req, res, next) => {

  deletedHospital = await Hospital.deleteOne({
       _id: req.params.id
    })

      if (deletedHospital.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }


};
//
