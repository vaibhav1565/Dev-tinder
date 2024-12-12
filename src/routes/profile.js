const express = require('express')
const profileRouter = express.Router()

const bcrypt = require('bcrypt')

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validatePasswordChange } = require('../models/utils/validation');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (e) {
        res.status(400).send("ERROR " + e)
    }
})
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isValid = validateEditProfileData(req)
        if (!isValid){
            throw new Error("Invalid edit request!")
        }
        const user = req.user
        Object.keys(req.body).forEach(field => user[field] = req.body[field])
        await user.save()
        res.send(`${user.firstName}, your profile has been updated successfully!`)
    } catch (e) {
        res.status(400).send("ERROR " + e)
    }
})
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        validatePasswordChange(req)

        const user = req.user
        const {password} = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        user["password"] = passwordHash

        await user.save()
        res.send("Password updated successfully!")
    } catch (e) {
        res.status(400).send("ERROR " + e)
    }
})

module.exports = profileRouter