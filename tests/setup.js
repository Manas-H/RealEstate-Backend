const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

before(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
