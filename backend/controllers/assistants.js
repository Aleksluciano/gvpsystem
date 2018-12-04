const Assistant = require("../models/assistant");

exports.createAssistant = async (req, res, next) => {

  const assistant = new Assistant({
    name: req.body.name,
    hospitals: req.body.hospitals,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone
  });

  savedAssistant = await assistant.save();
  res.status(201).json({
    message: "Assistant created!",
    assistant: savedAssistant
  });

}




exports.updateAssistant = async (req, res, next) => {

  const assistant = new Assistant({
    _id: req.body.id,
    name: req.body.name,
    hospitals: req.body.hospitals,
    mobilePhone: req.body.mobilePhone,
    phone: req.body.phone

  });

  updatedAssistant = await Assistant.updateOne( {_id: req.params.id}, assistant);

  if (updatedAssistant.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getAssistants = async (req, res, next) => {

  const fetchedAssistants = await Assistant.find();

  res.status(200).json({
    message: "Assistants fetched successfully!",
    assistants: fetchedAssistants
  });

}




exports.deleteAssistant = async(req, res, next) => {

  deletedAssistant = await Assistant.deleteOne({
       _id: req.params.id
    })

      if (deletedAssistant.n > 0) {
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
