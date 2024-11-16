require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const cluster = require("cluster");
const os = require("os");

const numCPUs = os.cpus().length;

console.log("numCPUs", numCPUs);

const clientid = process.env.CLIENTID;
const clientsecret = process.env.CLIENTSECRET;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize user", user);
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://127.0.0.1:5173/create",
    failureRedirect: "http://127.0.0.1:5173",
  })
);

app.get("/login/success", async (req, res) => {
  console.log("req.user:", req.user);

  if (req.user) {
    res.status(200).json({ message: "User logged in", user: req.user });
  } else {
    res.status(400).json({ message: "Not authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://127.0.0.1:5173/");
  });
});

app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker process ${process.pid} started`);

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} with worker ${process.pid}`);
  });
}
