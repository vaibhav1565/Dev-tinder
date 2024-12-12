const express = require('express')
const authRouter = express.Router()

const bcrypt = require('bcrypt')

const { User } = require('../models/user');
const { validateSignUpData } = require('../models/utils/validation');


authRouter.post("/signup", async (req, res) => {
    // creating a new instance of 'User' model
    try {
        //Validation of data
        validateSignUpData(req);
        const { firstName, lastName, emailID, password } = req.body

        //Encryption of password
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(`Password hash generated- ${passwordHash}`)
        const u = new User({
            firstName, lastName, emailID, password: passwordHash
        });
        await u.save();
        res.send("User added successfully!")
    } catch (e) {
        res.status(400).send("Error happened " + e.message);
    }

})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailID, password } = req.body
        const user = await User.findOne({ emailID: emailID })
        if (!user) throw new Error("User not found");
        const isPasswordValid = user.validatePassword(password)

        if (isPasswordValid) {
            //Create JWT Token
            //add token to cookie and send it

            const token = user.getJWT()

            res.cookie("token", token, {expires: new Date(Date.now() + 7 * 86400)})
            res.send("Login successful!")
        } else {
            throw new Error("Invalid password")
        }
    } catch (e) {
        res.status(400).send("ERROR: " + e.message)
    }
})

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Successfully logged out")
})

module.exports = authRouter