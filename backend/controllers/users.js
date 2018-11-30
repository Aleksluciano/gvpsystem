const User = require("../models/user");

exports.createUser = async (req, res, next) => {

  const user = new User({
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
    perfil: req.body.perfil,
    region: req.body.region,
    password: req.body.password
  });

//
  savedUser = await user.save();
  savedUser.password = "";
  res.status(201).json({
    message: "User created!",
    user: savedUser
  });

}




exports.updateUser = async (req, res, next) => {

  const user = new User({
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
    perfil: req.body.perfil,
    region: req.body.region
  });

  updatedUser = await User.updateOne( {_id: req.params.id}, user);

  if (updatedUser.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getUsers = async (req, res, next) => {

  const fetchedUsers = await User.find({},{password:0});

  res.status(200).json({
    message: "Users fetched successfully!",
    users: fetchedUsers
  });

}



exports.getOneUser = async (req, res, next) => {

  const fetchedUser = await User.findById({_id: req.params.id },{password:0});

  res.status(200).json({
    message: "User fetched successfully!",
    user: fetchedUser
  });

}




exports.deleteUser = async(req, res, next) => {

  deletedUser = await User.deleteOne({
       _id: req.params.id
    })

      if (deletedUser.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }


};
