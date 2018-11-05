module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    }
    catch(error) {
      console.log(error);
      if(error.kind == 'unique')error.message = 'O nome já existe no banco de dados';
      res.status(500).json({
        message: error.message
      });
    }
  };
}
