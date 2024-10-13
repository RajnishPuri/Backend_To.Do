const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database Connection is Established at: ${mongoose.connection.host}`);
    } catch (e) {
        console.log(`Error While Connecting to Database: ${e}`);
    }
};

module.exports = dbConnect;