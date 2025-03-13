import express from "express";
import session from "express-session";
import cors from "cors";
import https from "https";
import fs from "fs";
import * as notionApi from "./src/notionApi.js";
import util from "util";
import path from "path";
import { fileURLToPath } from "url";

// initialize path variables for ESM
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// server
const app = express();

// middleware
app.use(
  session({
    secret: "kcalculator_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: false,
      httpOnly: true,
    },
  }),
);
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(
  cors({
    origin: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  }),
);

// routes
app.get("/api/authenticate", async (req, res) => {
  console.log(`SESSION ID: ${req.sessionID}`);

  if (req.session.authorized) {
    res.json({
      username: req.session.accessToken.owner.user.name,
      avatarUrl: req.session.avatarUrl,
      // session: req.session,
    });
  } else {
    res
      .status(401)
      .json({ error: "User has not yet authorized, cannot authenticate" });
  }
});

app.post("/api/authorize", async (req, res) => {
  console.log(`SESSION ID: ${req.sessionID}`);
  console.log("PAYLOAD:");
  console.log(util.inspect(req.body, false, null, true));

  if (!req.session.authorized && req.body.code) {
    const accessToken = await notionApi.getAccessToken(req.body.code);

    if (accessToken.error) {
      console.log(accessToken);
      res.status(400).json(accessToken);
    } else {
      // create session
      req.session.accessToken = accessToken; // private
      req.session.authorized = true; // server side logic
      (req.session.username = accessToken.owner.user.name), // public
        (req.session.avatarUrl = accessToken.owner.user.avatar_url);

      // return public info for authentication (sessionId cookie included automatically)
      res.json({
        username: req.session.username,
        avatarUrl: req.session.avatarUrl,
        // session: req.session,
      });
    }
  } else {
    let apiResponse = { errors: [] };

    // build errors array
    if (req.session.authorized) {
      apiResponse.errors.push(`User already authorized.`);
    }
    if (!req.body.code) {
      apiResponse.errors.push(`No code provided in payload`);
    }

    res.status(400).json(apiResponse);
  }
});

app.get("/api/getrecipes", async (req, res) => {
  console.log(`SESSION ID: ${req.sessionID}`);

  if (req.session.authorized && !req.session.dbsFetched) {
    const databasesResponse = await notionApi.getDatabases(
      req.session.accessToken.access_token,
    );
    if (databasesResponse.error) {
      res.status(500).json(databasesResponse);
    }
    req.session.databases = databasesResponse;
    req.session.dbsFetched = true; // skip fetching dbs for this session in the future

    getRecipes();
  } else if (req.session.authorized) {
    getRecipes();
  } else {
    res.status(401).json({
      errors: ["User has not yet authorized, cannot access Notion resources"],
    });
  }

  async function getRecipes() {
    try {
      const recipesResponse = await notionApi.getRecipes(
        req.session.accessToken.access_token,
        req.session.databases.recipes.id,
      );
      res.json(recipesResponse);
    } catch (err) {
      res.status(500).json({ errors: [JSON.parse(err.body).message] });
    }
  }
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("ssl/kcalculator.key"),
    cert: fs.readFileSync("ssl/kcalculator.crt"),
  },
  app,
);

const port = 3000;
httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});

// app.listen(3000);
