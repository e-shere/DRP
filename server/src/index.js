const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const Pusher = require("pusher");
const redis = require("redis");

// ==== retrieve env variables ====
require("dotenv").config();

const { PORT, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USER } = process.env;
const REDIS_URL = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
const pusher = new Pusher({
    appId: process.env.PUSHER_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

// === end of retrieve env variables ===

const BUILD_DIR = "/../../client/build/";
const PUSHER_CHANNEL = "clarify";
const SUBMIT_EVENT = "submit";
const ADD_TO_EXTENSION = "addex";
const DB_KEY = "demo";
const STYLE_KEY = "styles";
const PRODUCTION = process.env.NODE_ENV == "production";
const STAGING = process.env.NODE_ENV == "test";

const app = express();
const path = require("path")

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, BUILD_DIR)))

app.get("/api", (_, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/serve-presets", async (_, res) => {
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();
    console.log("Connection to redis client established");
    console.log("Serving presets from database...");
    var tableData = []

    var keys = await client.keys('*', async (err, keys) => {
        if (err) return console.log(err);
    });

    console.log(keys);
    
    // WARNING: horrid code, I humbly aplogise...
    var key = keys[0];
    for(var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        tableData.push({id: i, freq: await client.get(key), preset: key});
    }

    // client.quit();

    console.log(tableData);
    res.json(tableData);  
});

// Anything that doesn't match the above, send back index.html
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname + BUILD_DIR + "index.html"))
})

app.post(`/${SUBMIT_EVENT}`, async (req, res) => {
    if (PRODUCTION || STAGING) {
        // send to pusher only in production (to be isolated when running locally)
        const payload = req.body;
        pusher.trigger(PUSHER_CHANNEL, SUBMIT_EVENT, payload);
        console.log("Submitting");
        res.send(payload);
    }
});

app.post("/add-preset", async (req, res) => {
    console.log(req.body);
    var preset = JSON.parse(req.body.data);
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();

    var gId = assignGroupID(hexToRgb(preset.bgColor)) + ":" + preset.font;

    console.log("Connection to redis client established");
    console.log(`Adding to key "${gId}" in database...`);
    
    client.incr(gId, "0", (err, res) => { 
        if (err) console.log(err);
        console.log(res);
    });
    // client.quit()
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


  
  function hexToRgb(hex) {
    var parsedHexVal = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
      r: parseInt(parsedHexVal[1], 16),
      g: parseInt(parsedHexVal[2], 16),
      b: parseInt(parsedHexVal[3], 16)
    };
  }
  
  function assignGroupID(rgb) {
    return affixColourRange(rgb.b) + ":" + affixColourRange(rgb.g) + ":" + affixColourRange(rgb.r);
  }
  
  function affixColourRange(colour) {
    const groupSize = 15
    return String(Math.floor(colour / groupSize) * groupSize);
  }
  