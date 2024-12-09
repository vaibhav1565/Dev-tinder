const mongoose=require('mongoose');
require('dotenv').config();

const connectDB = async ()=> {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING + "HelloWorld");
}
module.exports={connectDB};