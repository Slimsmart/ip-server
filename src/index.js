require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const { ip, admin } = require("./routes");
const { connectDB } = require("./db");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 3000;

const corsOptions = {
  credentials: true,
  origin: [
    "https://ipland-app.herokuapp.com",
    "http://localhost:5173",
    "https://ipland-server.herokuapp.com",
  ],
};

const sess = {
  secret: process.env.SESSION_SECRET,
  name: "sessionId",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  store: MongoDBStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    autoRemove: "native", // Default
  }),
  resave: true,
  saveUninitialized: false,
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

process.on("unhandledRejection", (reason, handler) => {
  console.log("reason: ", reason);
});

process.on("uncaughtException", (error, origin) => {
  console.log(error);
});

app.use(express.json());
app.use(cors(corsOptions));

app.use(session(sess));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app
  .listen(PORT, async () => {
    await connectDB();
    console.log(`server runining of http://localhost:${PORT}`);
  })
  .setTimeout(210000);

app.use("/api/v1", ip);
app.use("/api/v1", admin);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "works!" });
});

app.use((req, res, next) => {
  next(new Error("no route found!"));
});

app.use(function (error, req, res, next) {
  if (process.env.NODE_ENV === "development") {
    return res.status(400).json({
      message: error.message,
    });
  }
});
