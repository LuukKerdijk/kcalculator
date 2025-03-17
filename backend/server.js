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
app.post("/api/authorize", async (req, res) => {
  console.log(`AUTHORIZING, SESSION ID: ${req.sessionID}`);

  if (!req.session.authorized && req.body.code) {
    const accessToken = await notionApi.getAccessToken(req.body.code);

    if (accessToken.error) {
      res.status(400).send(accessToken.error_description);
    } else {
      req.session.accessToken = accessToken;
      req.session.authorized = true;
      req.session.username = accessToken.owner.user.name;
      req.session.avatarUrl = accessToken.owner.user.avatar_url;
      res.json({ message: "authorization success!" }); // frontend expects json response, otherwise throws error
    }
  } else {
    if (req.session.authorized) {
      res.status(400).send(`User already authorized.`);
    }
    if (!req.body.code) {
      res.status(400).send(`No code provided in payload`);
    }
  }
});

app.get("/api/authenticate", (req, res) => {
  console.log(`AUTHENTICATING, SESSION ID: ${req.sessionID}`);

  if (req.session.authorized) {
    res.json({
      username: req.session.accessToken.owner.user.name,
      avatarUrl: req.session.avatarUrl,
    });
  } else {
    res.status(401).send("User has not yet authorized, cannot authenticate");
  }
});

app.get("/api/getrecipes", async (req, res) => {
  console.log(`GETTING RECIPES, SESSION ID: ${req.sessionID}`);

  if (req.session.authorized && !req.session.dbsFetched) {
    const databasesResponse = await notionApi.getDatabases(
      req.session.accessToken.access_token,
    );
    if (databasesResponse.error) {
      res.status(500).json(databasesResponse);
    }
    req.session.databases = databasesResponse;
    req.session.dbsFetched = true; // skip fetching dbs for this session in the future

    console.log(req.session.databases);

    getRecipes();
  } else if (req.session.authorized) {
    getRecipes();
  } else {
    res
      .status(401)
      .send("User has not yet authorized, cannot access Notion resources");
  }

  async function getRecipes() {
    try {
      const recipesResponse = await notionApi.getRecipes(
        req.session.accessToken.access_token,
        req.session.databases.recipes.id,
      );
      res.json(recipesResponse);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
});

app.get("/api/getingredients", async (req, res) => {
  console.log(`GETTING INGREDIENTS, SESSION ID: ${req.sessionID}`);

  if (req.session.authorized && !req.session.dbsFetched) {
    const databasesResponse = await notionApi.getDatabases(
      req.session.accessToken.access_token,
    );
    if (databasesResponse.error) {
      res.status(500).json(databasesResponse);
    }
    req.session.databases = databasesResponse;
    req.session.dbsFetched = true; // skip fetching dbs for this session in the future

    getIngredients();
  } else if (req.session.authorized) {
    getIngredients();
  } else {
    res
      .status(401)
      .send("User has not yet authorized, cannot access Notion resources");
  }

  async function getIngredients() {
    try {
      const recipesResponse = await notionApi.getIngredients(
        req.session.accessToken.access_token,
        req.session.databases.ingredients.id,
      );
      res.json(recipesResponse);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
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
