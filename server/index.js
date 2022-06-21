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

const BUILD_DIR = "../client/build/";
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
    
    // WARNING: horrid code, I humbly aplogise...
    for(var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];
        tableData.push({freq: await client.get(key), preset: key});
      }

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
    const { preset } = req.body;
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();
    console.log("Connection to redis client established");
    var gId = preset.gId;
    console.log(`Adding key "${gId}" to database`);
    client.incr(gId, "0", (err, res) => { 
        if (err) console.log(err);
        console.log("adding " + res);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


