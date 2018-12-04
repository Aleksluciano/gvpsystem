const Accommodation = require("../models/accommodation");

exports.createAccommodation = async (req, res, next) => {

  const accommodation = new Accommodation({
    name: req.body.name,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement,
    responsable: req.body.responsable,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone
  });

  savedAccommodation = await accommodation.save();
  res.status(201).json({
    message: "Accommodation created!",
    accommodation: savedAccommodation
  });

}




exports.updateAccommodation = async (req, res, next) => {

  const accommodation = new Accommodation({
    _id: req.body.id,
    name: req.body.name,
    cep: req.body.cep,
    state: req.body.state,
    city: req.body.city,
    neighborhood: req.body.neighborhood,
    address: req.body.address,
    numeral: req.body.numeral,
    complement: req.body.complement,
    responsable: req.body.responsable,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone
  });

  updatedAccommodation = await Accommodation.updateOne( {_id: req.params.id}, accommodation);

  if (updatedAccommodation.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getAccommodations = async (req, res, next) => {

  const fetchedAccommodations = await Accommodation.find();

  res.status(200).json({
    message: "Accommodations fetched successfully!",
    accommodations: fetchedAccommodations
  });

}




exports.deleteAccommodation = async(req, res, next) => {

  deletedAccommodation = await Accommodation.deleteOne({
       _id: req.params.id
    })

      if (deletedAccommodation.n > 0) {
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
