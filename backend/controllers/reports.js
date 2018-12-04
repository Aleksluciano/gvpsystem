const Report = require("../models/report");

exports.createReport = async (req, res, next) => {

  const report = new Report({
   typeReport: req.body.typeReport,
   patientId: req.body.patientId,
   assitantId: req.body.assistantId,
   visitDate: req.body.visitDate,
   gvpId1: req.body.gvpId1,
   gvpId2: req.body.gvpId2,
   description: req.body.string
  });

  savedReport = await report.save();
  res.status(201).json({
    message: "Report created!",
    report: savedReport
  });

}




exports.updateReport = async (req, res, next) => {

  const report = new Report({
    _id: req.body.id,
    typeReport: req.body.typeReport,
    patientId: req.body.patientId,
    assitantId: req.body.assistantId,
    visitDate: req.body.visitDate,
    gvpId1: req.body.gvpId1,
    gvpId2: req.body.gvpId2,
    description: req.body.string
  });

  updatedReport = await Report.updateOne( {_id: req.params.id}, report);

  if (updatedReport.n > 0) {
    res.status(200).json({
      message: "Update successful!"
    });
  } else {
    res.status(401).json({
      message: "Not authorized!"
    });
  }

};




exports.getReports = async (req, res, next) => {

  const fetchedReports = await Report.find();

  res.status(200).json({
    message: "Reports fetched successfully!",
    reports: fetchedReports
  });

}




exports.deleteReport = async(req, res, next) => {

  deletedReport = await Report.deleteOne({
       _id: req.params.id
    })

      if (deletedReport.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }


};

