const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connect = require("../api/connectDB/DBconnect");
const Authroute = require("./routes/auth");
const Hotelroute = require("./routes/hotels");
const Userroute = require("./routes/users");
const customError = require("./utils/customError");
const globalErrorHandler = require("./utils/globalErrorHandler");
const cookieParser = require("cookie-parser");
dotenv.config();

// MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", Authroute);
app.use("/api/hotel", Hotelroute);
app.use("/api/user", Userroute);

//ERROR IF ROUTE DONT EXIST IN SERVER
app.all("*", (req, res, next) => {
  const err = new customError(
    `Can't Find http://localhost:8080${req.originalUrl} on the Server`,
    404
  );
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;

// START THE SERVER
app.listen(port, async () => {
  await connect();
  console.log(
    `Server Running on port ${port} and Database connected Successfully`
  );
});
