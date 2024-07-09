const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE;
mongoose
    .connect(DB)
    .then((con) => console.log('🟢 DB connection successful! 🟢'))
    .catch((err) =>console.error('🔴 Database connection error 🔴:', err));
const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// handle unhandledRejection kima mochkla fl db
// crashing is optional
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
});

// handle uncaughtException kima theb taffichi haja mch maojouda aaslan
// crashing is bessif aliik :) !!!
