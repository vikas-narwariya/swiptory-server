// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler.js");

// Import routes
const userRoutes = require("./routes/userRoutes.js");
const storyRoutes = require("./routes/storyRoutes.js");
const connectDB = require("./config/connectDB.js");

dotenv.config();

const app = express();

// ====================================================== MIDDLEWARE =====================================================
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   res.header("Access-Control-Allow-Credentials", "true");

//   next();
// });

// app.use(cors());
// const whitelist = [
//   "https://swiptory.web.app/",
//   "http://localhost:5000",
//   "http://localhost:3000",
// ];
// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin)) return callback(null, true);

//     callback(new Error("Not allowed by CORS"));
//   },
// };

// app.use(cors());
// const corsOptions = {
//   credentials: true,
//   origin: "*",
// };
app.use(cors());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Since I am running multiple domain servers, the backend was behind a reverse proxy.
//  By enabling trust proxy, my backend app will understand that its sitting behind a proxy and the X-Forwarded- header fields may be trusted.
// app.set("trust proxy", 1);

//-------------------- Connect to Database --------------------
connectDB();

// routes
app.use("/api/user", userRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/health", (req, res) => {
  res.send("it is working fine");
});

// app.get("/", async (req, res) => {
//   res.status(200).json("Server is up and running");
// });

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
