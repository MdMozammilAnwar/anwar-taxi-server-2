"use strict";
const { sequelize } = require("../configs/db");
//UserLogin --
module.exports = {
    GetUserDetailById(req, res) {
        const { userId } = req.body;
        const query = "SELECT GetUserDetail($1)";
        const bindings = [userId];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            if (queryResult && queryResult.length > 0) {
                const userData = queryResult[0].getuserdetail.replace(/\(|\)/g, '').split(',');
    
                const [user_id, fk_role_id, first_name, last_name, email, mobile, address, status] = userData.map(value => value.replace(/"/g, ''));
    
                const userObj = {
                    userId: user_id,
                    name: `${first_name} ${last_name}`,
                    email,
                    mobile,
                    address,
                    status: (status == 0 ? "In-Active" : "Active")
                };
    
                res.status(200).json(userObj);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error retrieving user data" });
        });
    },
    UserRegistration(req, res) {
        
        const { role,firstName,lastName,email,password,mobile,address } = req.body;
        if (!role || !firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const query = "SELECT UserRegistration($1,$2,$3,$4,$5,$6,$7)";
        const bindings = [role,firstName,lastName,email,password,mobile,address];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const userData = queryResult[0].userregistration;
                const message="User registered successfully!";
                res.status(200).json({success: true,userId:userData,message:message});
            } else {
                res.status(404).json({ success: false,message: "User not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error registring user" });
        });
    },
    UserLogin(req,res){
        const { email,password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing emailid or password" });
        }
        const query = "SELECT UserLogin($1,$2)";
        const bindings = [email,password];
    
        sequelize.query(query, {
            bind: bindings,
            type: sequelize.QueryTypes.SELECT,
        })
        .then(queryResult => {
            console.log("returning data from query : "+JSON.stringify(queryResult));
            //[{"userregistration":4}]
            if (queryResult.length > 0) {
                const userLoginData = queryResult[0].userlogin;
                console.log("userLoginData :: "+JSON.stringify(userLoginData));
                const data=userLoginData.substring(1,userLoginData.length-1).split(',');
                const userId=data[0].replace(/"/g, "");
                const name=data[1].replace(/"/g, "");
                let role=data[2].replace(/"/g, "");
                const email=data[3].replace(/"/g, "");
                const mobile=data[4].replace(/"/g, "");
                const address=data[5].replace(/"/g, "");
                if(role==1){
                    role="User";
                }
                else if(role == 2){
                    role="Driver";
                }
                let obj={
                    userId:userId,
                    name:name,
                    role:role,
                    email:email,
                    mobile:mobile,
                    address:address
                }
                // Check the result of the function
                if (!userId) {
                    res.status(404).json({ success: false, message: 'Login failed. Invalid email or password.' });
                } else {
                    res.status(200).json({ success: true, user: obj , message:"Login successfully!"});
                }
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while user login" });
        });
    },
    
};
