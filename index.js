const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dbConnect = require('./config/Database');
const Router = require('./routes/route');

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: 'https://frontend-to-do-seven.vercel.app/',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/v1', Router);


dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is Active on : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Failed to connect to database: ${error.message}`);
    });
