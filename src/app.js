const express = require('express');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express();
const {connectDB} = require("./config/database");
const {User} = require('./models/user');
const { validateSignUpData } = require('./models/utils/validation');
const { userAuth } = require('./middlewares/auth');

connectDB()
.then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
        console.log("Server is successfully listening to port 3000");
    });
})
.catch(err => { 
    console.log("Database connection failed")
    console.log(err)})

app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req,res)=>{
    // creating a new instance of 'User' model
    try{
        //Validation of data
        validateSignUpData(req);
        const {firstName, lastName, emailID, password} = req.body

        //Encryption of password
        const passwordHash = await bcrypt.hash(password,10)
        console.log(`Password hash generated- ${passwordHash}`)
        const u = new User({
            firstName, lastName, emailID, password: passwordHash
        });
        await u.save();
        res.send("User added successfully!")
    } catch(e) {
        res.status(400).send("Error happened " + e.message);
    }

})

app.post("/login", async(req,res)=>{
    try{
        const {emailID, password} = req.body
        const user = await User.findOne({emailID: emailID})
        if (!user) throw new Error("User not found");
        const isPasswordValid = user.validatePassword(password)

        if (isPasswordValid){
            //Create JWT Token
            //add token to cookie and send it

            const token = user.getJWT()
            console.log(`JWT token- ${token}`)

            res.cookie("token", token)
            res.send("Login successful!")
        } else{
            throw new Error("Invalid password")
        }
    } catch(e) {
        res.status(400).send("ERROR: " + e.message)
    }
})

app.get("/profile", userAuth, async (req,res)=>{
    try{
        // const cookies = req.cookies;
        // // console.log(cookies);

        // const {token} = cookies;
        // if (!token){
        //     throw new Error("Invalid token")
        // }
        
        // const decodedMessage = jwt.verify(token, "private_key")
        // console.log(`Decoded message- ${decodedMessage}`)

        // const user = await User.findOne({_id: decodedMessage._id})
        // if (!user){
        //     throw new Error("User not found")
        // }
        // res.send(user)

        const user = req.user
        res.send(user)
    } catch(e) {
        res.status(400).send("ERROR " + e)
    }
})

app.get("/sendConnectionRequest", userAuth, async(req,res)=>{
    console.log("Sending a connection request!")

    const user = req.user
    res.send(user.firstName + " send a connection request!")
})
// app.get("/user", async (req,res)=>{
//     const userEmail = req.body.emailId;

//     try{
//         const user = await User.findOne({emailId: userEmail})
//         if (user) {
//             res.send(user)
//         } else{
//             res.send("User not found")
//         }
//     } catch(e) {
//         res.status(400).send("Something went wrong")
//     }
// })

// app.get("/feed", async (req,res)=>{
//     try{
//         const users = await User.find({})
//         res.send(users)
//     } catch(e) {
//         res.status(400).send("Something went wrong")
//     }
// })


// app.delete("/delete", async (req,res)=>{
//     const userId = req.body.userId
//     try{
//         const user = await User.findById(userId)
//         if (user) {
//             await User.findByIdAndDelete(userId)
//             res.send("User deleted successfully")
//         } else{
//             res.status(404).send("User not found")
//         }
        
//     } catch(e) {
//         res.status(400).send("Something went wrong")
//     }
// })

// app.patch("/update", async(req,res)=>{
//     const userEmail = req.body.emailId
//     const body = req.body


//     try{
//         const ALLOWED_UPDATES = ["skills", "gender", 'age', 'photoURL']
//         const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))

//         if (!isUpdateAllowed) {
//             throw new Error("Update not allowed")
//         }
//         const user = await User.find({emailId: userEmail})
//         if (user) {
//             await User.findOneAndUpdate({emailId: userEmail}, body, {runValidators: true})
//             res.send("User updated successfully!")
//         } else{
//             res.status(404).send("User not found!")
//         }  
//     } catch(e) {
//         res.status(400).send("Updated failed: " +  e.message)
//     }
// })