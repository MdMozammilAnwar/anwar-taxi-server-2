const express = require("express");
const router = express.Router();


const rideController = require("../controllers/ride");

router.post("/Ride/RideRequest", (req, res) => {
    rideController.RideRequest(req, res);
});
router.post("/Ride/RideAccept", (req, res) => {
    rideController.RideAccept(req, res);
});
router.post("/Ride/RideConfirmByUser", (req, res) => {
    rideController.RideConfirmByUser(req, res);
});
router.post("/Ride/RideByFromDestination", (req, res) => {
    rideController.RideByFromDestination(req, res);
});
router.post("/Ride/GetUpcomingRideById", (req, res) => {
    rideController.GetUpcomingRideById(req, res);
});
router.post("/Ride/AllUpcomingRides", (req, res) => {
    rideController.AllUpcomingRides(req, res);
});
router.post("/Ride/GetAllRides", (req, res) => {
    rideController.GetAllRides(req, res);
});

// rideController -- RideController Controller modules ends here

module.exports = router;
