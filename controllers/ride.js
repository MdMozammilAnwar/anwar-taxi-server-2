"use strict";
const { sequelize } = require("../configs/db");
//UserLogin --
module.exports = {
    
    RideRequest(req, res) {
        const { userId,fromDestination,toDestination,rideTime } = req.body;
        if (!userId || !fromDestination || !toDestination || !rideTime ) {
            return res.status(400).json({ message: "Missing the information, ride can't be process" });
        }
        const query = "SELECT RideRequest($1,$2,$3,$4)";
        const bindings = [userId,fromDestination,toDestination,rideTime];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult[0].riderequest;
                const message="Ride requested successfully, wait for the driver response!";
                res.status(200).json({success: true,rideId:rideData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be requested, Provide the proper data" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error requesting ride" });
        });
    },
    RideAccept(req, res) {
        const { userId,rideId,rideTimeByDriver,rideFare } = req.body;
        if (!userId || !rideId || !rideTimeByDriver || !rideFare ) {
            return res.status(400).json({ message: "Missing the information, ride can't be accepted" });
        }
        const query = "SELECT RideAccept($1,$2,$3,$4)";
        const bindings = [userId,rideId,rideTimeByDriver,rideFare];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult[0].rideaccept;
                const message="Ride accepted successfully!";
                res.status(200).json({success: true,rideStatus:rideData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be accepted, Provide the proper data" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error accepting ride" });
        });
    },
    RideByFromDestination(req,res){
        const { fromDestination } = req.body;
        if (!fromDestination ) {
            return res.status(400).json({ message: "Missing the information, Please provide valid from destination" });
        }
        const query = "SELECT GetRideByFromDestination($1)";
        const bindings = [fromDestination];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult;
                console.log("rideData : "+JSON.stringify(rideData));
                
                
                const transformedData = rideData.map(data => {
                    const rideObj = data.getridebyfromdestination;
                    const matchedData = rideObj.substring(1, rideObj.length - 1).split(',');
                
                    const rideId = parseInt(matchedData[0]);
                    const userId = parseInt(matchedData[1]);
                    const userName = matchedData[2].replace(/"/g, "");
                    const userEmail = matchedData[3].replace(/"/g, "");
                    const userMobile = matchedData[4].replace(/"/g, "");
                    const fromDestination = matchedData[5].replace(/"/g, "");
                    const toDestination = matchedData[6].replace(/"/g, "");
                    const rideTimeByUser = matchedData[7].replace(/"/g, "");
                    const status = parseInt(matchedData[8]);
                    const createdBy = matchedData[9] === "null" ? null : parseInt(matchedData[9]);
                    const createdOn = matchedData[10].replace(/"/g, "");
                
                    return {
                        rideId,
                        userId,
                        userName,
                        userEmail,
                        userMobile,
                        fromDestination,
                        toDestination,
                        rideTimeByUser,
                        status,
                        createdBy,
                        createdOn
                    };
                });

                console.log("transformedData : "+JSON.stringify(transformedData));
                const message="Ride Found";
                res.status(200).json({success: true,rideDetails:transformedData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be found, Provide the proper data" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error retriving ride" });
        });
    },
    GetUpcomingRideById(req,res){
        const { userId } = req.body;
        if (!userId ) {
            return res.status(400).json({ message: "Missing the information, Please provide valid user id" });
        }
        const query = "SELECT GetUpcomingRide($1)";
        const bindings = [userId];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult;
                console.log("rideData : "+JSON.stringify(rideData));
                
                
                const transformedData = rideData.map(data => {
                    const rideObj = data.getupcomingride;
                    const matchedData = rideObj.substring(1, rideObj.length - 1).split(',');
                    
                    const rideId = parseInt(matchedData[0]);
                    const driverId = parseInt(matchedData[1]);
                    const driverName = matchedData[2].replace(/"/g, "");
                    const driverEmail = matchedData[3].replace(/"/g, "");
                    const driverMobile = matchedData[4].replace(/"/g, "");
                    const fromDestination = matchedData[5].replace(/"/g, "");
                    const toDestination = matchedData[6].replace(/"/g, "");
                    const rideTimeByDriver = matchedData[7].replace(/"/g, "");
                    const rideFare = matchedData[8].replace(/"/g, "");
                    let status = parseInt(matchedData[9]);
                    if(status == 0){
                        status="Requested"
                    }
                    else if(status == 1){
                        status="Accepted"
                    }
                    else if(status == 2){
                        status="Completed"
                    }
                    return {
                        rideId,
                        driverId,
                        driverName,
                        driverMobile,
                        driverEmail,
                        fromDestination,
                        toDestination,
                        rideTimeByDriver,
                        rideFare,
                        status
                    };
                });

                console.log("transformedData : "+JSON.stringify(transformedData));
                const message="Ride booked successfully, have a happy journey";
                res.status(200).json({success: true,rideDetails:transformedData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be found, Provide the proper userId" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error retriving upcoming ride" });
        });
    },
    GetAllRides(req,res){
        const { userId } = req.body;
        if (!userId ) {
            return res.status(400).json({ message: "Missing the information, Please provide valid user id" });
        }
        const query = "SELECT GetAllRide($1)";
        const bindings = [userId];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult;
                console.log("rideData : "+JSON.stringify(rideData));
                
                
                const transformedData = rideData.map(data => {
                    const rideObj = data.getallride;
                    const matchedData = rideObj.substring(1, rideObj.length - 1).split(',');
                    
                    const rideId = parseInt(matchedData[0]);
                    const driverId = parseInt(matchedData[1]);
                    const driverName = matchedData[2].replace(/"/g, "");
                    const driverEmail = matchedData[3].replace(/"/g, "");
                    const driverMobile = matchedData[4].replace(/"/g, "");
                    const fromDestination = matchedData[5].replace(/"/g, "");
                    const toDestination = matchedData[6].replace(/"/g, "");
                    const rideTimeByDriver = matchedData[7].replace(/"/g, "");
                    const rideFare = matchedData[8].replace(/"/g, "");
                    let status = parseInt(matchedData[9]);
                    if(status == 0){
                        status="Requested"
                    }
                    else if(status == 1){
                        status="Accepted"
                    }
                    else if(status == 2){
                        status="Completed"
                    }
                    return {
                        rideId,
                        driverId,
                        driverName,
                        driverMobile,
                        driverEmail,
                        fromDestination,
                        toDestination,
                        rideTimeByDriver,
                        rideFare,
                        status
                    };
                });

                console.log("transformedData : "+JSON.stringify(transformedData));
                const message="Ride booked successfully, have a happy journey";
                res.status(200).json({success: true,rideDetails:transformedData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be found, Provide the proper userId" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error retriving upcoming ride" });
        });
    },
    AllUpcomingRides(req,res){
        const { userId } = req.body;
        if (!userId ) {
            return res.status(400).json({ message: "Missing the information, Please provide valid user id" });
        }
        const query = "SELECT AllUpcomingRides($1)";
        const bindings = [userId];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult;
                console.log("rideData : "+JSON.stringify(rideData));
                
                
                const transformedData = rideData.map(data => {
                    const rideObj = data.allupcomingrides;
                    const matchedData = rideObj.substring(1, rideObj.length - 1).split(',');
                    
                    const rideId = parseInt(matchedData[0]);
                    const driverId = parseInt(matchedData[1]);
                    const driverName = matchedData[2].replace(/"/g, "");
                    const driverEmail = matchedData[3].replace(/"/g, "");
                    const driverMobile = matchedData[4].replace(/"/g, "");
                    const fromDestination = matchedData[5].replace(/"/g, "");
                    const toDestination = matchedData[6].replace(/"/g, "");
                    const rideTimeByDriver = matchedData[7].replace(/"/g, "");
                    const rideFare = matchedData[8].replace(/"/g, "");
                    let role = matchedData[8].replace(/"/g, "");
                    
                    let status = parseInt(matchedData[9]);
                    if(status == 0){
                        status="Requested"
                    }
                    else if(status == 1){
                        status="Accepted"
                    }
                    else if(status == 2){
                        status="Completed"
                    }
                    let objForUser={
                        rideId:rideId,
                        driverId :driverId,
                        driverName:driverName,
                        driverMobile:driverMobile,
                        driverEmail:driverEmail,
                        fromDestination:fromDestination,
                        toDestination:toDestination,
                        rideTimeByDriver:rideTimeByDriver,
                        rideFare:rideFare,
                        status:status
                    }
                    let objForDriver={
                        rideId:rideId,
                        userId :driverId,
                        userName:driverName,
                        userMobile:driverMobile,
                        userEmail:driverEmail,
                        fromDestination:fromDestination,
                        toDestination:toDestination,
                        rideTimeByDriver:rideTimeByDriver,
                        rideFare:rideFare,
                        status:status
                    }
                    return role == 1 ? objForUser : objForDriver
                    // if(role == 1){
                    //     return objForUser;
                    // }
                    // else if(role == 2){
                    //     return objForDriver;
                    // }
                    // return {
                    //     rideId,
                    //     driverId,
                    //     driverName,
                    //     driverMobile,
                    //     driverEmail,
                    //     fromDestination,
                    //     toDestination,
                    //     rideTimeByDriver,
                    //     rideFare,
                    //     status
                    // };
                });
                

                console.log("transformedData : "+JSON.stringify(transformedData));
                const message="Ride booked successfully, have a happy journey";
                res.status(200).json({success: true,rideDetails:transformedData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be found, Provide the proper userId" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error retriving upcoming ride" });
        });
    },
    RideConfirmByUser(req,res){
        const { userId, rideId, paymentMode } = req.body;
        if (!userId || !rideId || !paymentMode) {
            return res.status(400).json({ message: "Missing the information, Please provide valid data" });
        }
        const query = "SELECT ConfirmRide($1,$2,$3)";
        const bindings = [userId, rideId, paymentMode];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const rideData = queryResult;
                console.log("rideData : "+JSON.stringify(rideData));
                
                
                const transformedData = rideData.map(data => {
                    const rideObj = data.confirmride;
                    const matchedData = rideObj.substring(1, rideObj.length - 1).split(',');
                    
                    const rideId = parseInt(matchedData[0]);
                    const driverId = parseInt(matchedData[1]);
                    const driverName = matchedData[2].replace(/"/g, "");
                    const driverEmail = matchedData[3].replace(/"/g, "");
                    const driverMobile = matchedData[4].replace(/"/g, "");
                    const fromDestination = matchedData[5].replace(/"/g, "");
                    const toDestination = matchedData[6].replace(/"/g, "");
                    const rideTimeByDriver = matchedData[7].replace(/"/g, "");
                    const rideFare = matchedData[8].replace(/"/g, "");
                    let status = parseInt(matchedData[9]);
                    if(status == 0){
                        status="Requested"
                    }
                    else if(status == 1){
                        status="Accepted"
                    }
                    else if(status == 2){
                        status="Completed"
                    }
                    return {
                        rideId,
                        driverId,
                        driverName,
                        driverMobile,
                        driverEmail,
                        fromDestination,
                        toDestination,
                        rideTimeByDriver,
                        rideFare,
                        status
                    };
                });

                console.log("transformedData : "+JSON.stringify(transformedData));
                const message="List of rides";
                res.status(200).json({success: true,rideDetails:transformedData,message:message});
            } else {
                res.status(404).json({ success: false,message: "Ride can't be confirm, Provide the proper data" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error  confirming ride" });
        });
    }    
};
