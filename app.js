var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/User");
var productsRouter = require("./routes/Product");
var categoryRouter = require("./routes/Category");
var cartRouter = require("./routes/Cart");
var imageRouter = require("./routes/Image");
var db = require("./Models/db");
// connect Mongodb
db;
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use("/v1/user", usersRouter);
app.use("/v1/product", productsRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/upload", imageRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
