const Congregation = require("../models/congregation");

exports.createCongregation = async (req, res, next) => {

  const congregation = new Congregation({
    name: req.body.name,
  });

  savedCongregation = await congregation.save();
  res.status(201).json({
    message: "Congregation created!",
    congregation: savedCongregation
  });

}




exports.updateCongregation = async (req, res, next) => {

  const congregation = new Congregation({
    _id: req.body.id,
    name: req.body.name,
  });

  updatedCongregation = await Congregation.updateOne( {_id: req.params.id}, congregation);

  if (updatedCongregation.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getCongregations = async (req, res, next) => {

  const fetchedCongregations = await Congregation.find();

  res.status(200).json({
    message: "Congregations fetched successfully!",
    congregations: fetchedCongregations
  });

}




exports.deleteCongregation = async(req, res, next) => {

  deletedCongregation = await Congregation.deleteOne({
       _id: req.params.id
    })

      if (deletedCongregation.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }


};
