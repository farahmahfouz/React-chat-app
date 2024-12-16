const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { setupSocket } = require("./socket.js");

require("express-async-errors");

const app = express();
dotenv.config();
const server = http.createServer(app);


const userRouter = require("./Routes/userRoute.js");
const contactRouter = require("./Routes/contactRoute.js");
const messagesRouter = require("./Routes/messagesRoute.js");
const channelRouter = require("./Routes/channelRoute.js");

// app.use('/uploads/profiles', express.static('uploads/profiles'));

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use('/upload/file', express.static('upload/file'));
app.use(express.json());
app.use(cookieParser());

// Increase the payload size limit to 50 MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome on our server 🐣");
});

app.use("/api/auth", userRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/channels", channelRouter);

setupSocket(server);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected With MongoDB successfully🤸🤸");
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Faild to connect with MongoDB`, err);
  });