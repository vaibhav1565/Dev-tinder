const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 75
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/.test(value))) {
                throw new Error("Password is not valid")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max:150
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
        maxlength: 600,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid! " + value)
            }
        }
    },
    about: {
        type: String, 
        default: "This is a default description",
        maxlength: 255
    },
    skills: {
        type: [String,], //by default an empty array is created
        validate(value){
            if (!value.every(v => v.length <= 50)) {
                throw new Error("Number of characters cannot be more than 50!")
            }
            if (value.length > 10) {
                throw new Error("Skills cannot be more than 10")
            }
        }
    }
},
{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema);

module.exports={User};