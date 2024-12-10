const validator = require("validator")

const validateSignUpData = (req)=>{
    const {firstName, lastName, emailID, password} = req.body

    if (!firstName || !lastName){
        throw new Error("Name is not valid!")
    }
    else if (!validator.isEmail(emailID)){
        throw new Error("Email is not valid!")
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Password must be of alteast 8 characters, consisting of atleast one uppercase, one lowercase, one number and one special symbol")
    }
}

module.exports = {validateSignUpData}