const express = require('express')
const requestRouter = express.Router()

const ConnectionRequest = require('../models/connectionRequest')

const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');

requestRouter.post("/request/send/:status/:toUserID", userAuth, async (req, res) => {
    try {
        const fromUserID = req.user
        const toUserID = req.params.toUserID
        const status = req.params.status

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)){
            throw new Error("Invalid request!")
        }

        const toUser = await User.findById(toUserID)
        if (!toUser) {
            throw new Error("Invalid request!")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserID, toUserID },
                { fromUserID: toUserID, toUserID: fromUserID }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).send({
                message: "Connection already exists!" 
            })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserID,
            toUserID,
            status
        })

        const data = await connectionRequest.save()
        console.log(data)
        res.json({
            message: `${req.user.firstName} is ${status === "ignored" ? "not " : ""}interested in connecting with ${toUser.firstName}`,
            data
        })
    } catch (e) {
        res.status(400).send("ERROR " + e.message)
    }
})
requestRouter.post("/request/review/:status/:requestID", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status,requestID} = req.params;

        const allowedStatus = ["accepted","rejected"]
        if (!allowedStatus.includes(status)){
            throw new Error("Invalid status!")
        }

        
       const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserID: loggedInUser._id,
        status: "interested"
       })
       if (!connectionRequest){
        throw new Error("Invalid request");
       }

       connectionRequest.status = status;
       await connectionRequest.save();
       res.json({message: "Connection request", data: connectionRequest})

    } catch(e){
        res.status(400).send("ERROR: " + e.message);
    }
})

module.exports = requestRouter