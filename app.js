const express = require("express");
const http = require("http");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require("morgan");
const hpp = require('hpp');
const bodyParser = require("body-parser");
const path = require("path");
const controller = require("./controller/Controller");
const AppError = require('./middleware/errorHandler');
const globalErrorHandler = require('./controller/errorController');
const rootIndex = require("./routes/index");
                    /* to run the project write: npm run dev */

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//security http headers
app.use(helmet());

//limit request from same api
// Create a limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);
// body parser, reading sata from body into req.body
//app.use(express.json());
app.use(express.json({ limit: '100kb' }));

//data sanitization against NoSql query injection
app.use(mongoSanitize());

//data sanitization XXS
app.use(xss());

// Apply hpp middleware to protect against HTTP Parameter Pollution
app.use(hpp());

//{{URL}}api/v1/tours?sort=price&sort=duration
/*
app.use(
  hpp({
    whitelist: ['duration'],
  })
);
*/

//yatik time mta req
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: "Hello World!" });
});

app.use("/api", rootIndex);

const server = http.createServer(app);

// Socket.IO setup
const io = require("socket.io")(server);
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
