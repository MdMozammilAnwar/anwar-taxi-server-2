const express = require("express");
const router = express.Router();


const registrationController = require("../controllers/registration");
router.post("/Registration/RegisterUser", (req, res) => {
    registrationController.UserRegistration(req, res);
});
router.post("/Registration/UserLogin", (req, res) => {
    registrationController.UserLogin(req, res);
});
router.post("/Registration/GetUserDetailById", (req, res) => {
  registrationController.GetUserDetailById(req, res);
});


// registrationController -- Registration Controller modules ends here

module.exports = router;
