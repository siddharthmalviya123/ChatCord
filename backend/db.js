const mongoose = require('mongoose');


const connectToMongo = async () => {
    
    try {
        const coon = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB connected:`)
    }
    catch {
        console.log(error.message)
    }
}

module.exports = connectToMongo;

//just establishing connection with our database here using function connectToMongo.