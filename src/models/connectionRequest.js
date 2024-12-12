const mongoose = require('mongoose')


const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserID: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect data type`
        },
        required: true
    }
},
    {
        timestamps: true
    }
)
connectionRequestSchema.index({fromUserID: 1, toUserID: -1})
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this
    //Check if fromUserID is same as toUserID

    if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
        throw new Error("Cannot send connection request to yourself!")
    }
    next()
})
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;