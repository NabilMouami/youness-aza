const {
  createGroupe,
  getGroupes,
  AffectProuductsToGroupe,
} = require("./group.service");

module.exports = {
  createGrp: (req, res) => {
    const body = req.body;
    createGroupe(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  addProdsToGrp: (req, res) => {
    const body = req.body;
    AffectProuductsToGroupe(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getGrps: (req, res) => {
    getGroupes((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.status(200).json(results);
    });
  },
};
