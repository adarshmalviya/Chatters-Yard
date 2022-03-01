const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log("Connected to MongoDB"));

    }
    catch (error) {
        console.log(`Error : ${error.message}`)
    }
}

module.exports = connectDB;