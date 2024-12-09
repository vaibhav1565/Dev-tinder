const express = require('express');
const app = express();

const {connectDB} = require("./config/database");
const {User} = require('./models/user');

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

app.post("/signup", async (req,res)=>{
    // creating a new instance of 'User' model
    const u = new User(req.body);
    try{
        await u.save();
        res.send("User added successfully!")
    } catch(e) {
        res.status(400).send("Error happened " + e.message);
    }

})

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId: userEmail})
        if (user) {
            res.send(user)
        } else{
            res.send("User not found")
        }
    } catch(e) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(400).send("Something went wrong")
    }
})


app.delete("/delete", async (req,res)=>{
    const userId = req.body.userId
    try{
        const user = await User.findById(userId)
        if (user) {
            await User.findByIdAndDelete(userId)
            res.send("User deleted successfully")
        } else{
            res.status(404).send("User not found")
        }
        
    } catch(e) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/update", async(req,res)=>{
    const userEmail = req.body.emailId
    const body = req.body


    try{
        const ALLOWED_UPDATES = ["skills", "gender", 'age', 'photoURL']
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }
        const user = await User.find({emailId: userEmail})
        if (user) {
            await User.findOneAndUpdate({emailId: userEmail}, body, {runValidators: true})
            res.send("User updated successfully!")
        } else{
            res.status(404).send("User not found!")
        }  
    } catch(e) {
        res.status(400).send("Updated failed: " +  e.message)
    }
})