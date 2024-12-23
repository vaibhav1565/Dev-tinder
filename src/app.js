const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
const {connectDB} = require("./config/database");

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile") 
const requestRouter = require("./routes/request"); 
const userRouter = require('./routes/user');
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

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",requestRouter)
app.use("/",userRouter)