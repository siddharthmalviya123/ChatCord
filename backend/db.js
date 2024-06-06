const mongoose = require('mongoose');


const connectToMongo = async()=>{
    const coon=await mongoose.connect(process.env.MONGO_URI)
}

module.exports = connectToMongo;

//just establishing connection with our database here using function connectToMongo.