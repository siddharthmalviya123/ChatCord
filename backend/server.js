const express=require("express");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectToMongo = require("./db");
const bodyParser = require("body-parser");
const User = require("./models/userModel");
dotenv.config();
require('dotenv').config({ path: '../.env' })
const userRoutes = require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoute");
const messageRoutes=require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path=require('path');


const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());   ///to accept JSON data.

app.use(cors());

connectToMongo();





app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);


// -------------------------- Deployment ----------------------------------------------//


//current directory
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
  
// -------------------------- Deployment ----------------------------------------------//

app.use(notFound);
app.use(errorHandler);



const port = process.env.PORT||5000;

const server=app.listen(port,
    console.log(`Your port is ${process.env.PORT}`)
    );

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});


//listening to any connection between client and server.....whenever a client logs in he establishes a connection.
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  
  //Here he joins a room with his user id on setup.
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  // make user join a chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // whenever a new message is sent we want to send the messages to all other users of the chat in real time except the sender.
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);// we are emitting the message received socket here in the user room
                                                                      // which each user joined when logged in
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

})

