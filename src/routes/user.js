const express = require('express');
const userRouter = express.Router();

const ConnectionRequest = require('../models/connectionRequest');

const {userAuth} = require('../middlewares/auth');

const USER_POPULATE_FIELDS = "firstName lastName age gender photoURL";

userRouter.get("/user/requests/received", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const pendingRequests = await ConnectionRequest.find({
            toUserID: loggedInUser._id,
            status: "interested"
        })
        .populate("fromUserID", USER_POPULATE_FIELDS)
        res.send(pendingRequests);
        // res.json({message: "Data received", data: pendingRequests})
    } catch(e){
        res.status(400).send("ERROR: " + e.message);
    }
})

userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const userConnections = await ConnectionRequest.find({
            $or: [
                { fromUserID: loggedInUser._id, status: "accepted" },
                { toUserID: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserID", USER_POPULATE_FIELDS)
        .populate("toUserID", USER_POPULATE_FIELDS);

        const data = userConnections.map(connection => {
            if (connection.fromUserID._id === loggedInUser._id) {
                return connection.toUserID
            }
            return connection.fromUserID
        })
        res.send(data);
    } catch(e){
        res.status(400).send("ERROR: " + e.message);
    }
    
})

module.exports = userRouter;