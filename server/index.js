const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const Pusher = require("pusher");
const redis = require("redis");
const redisScan = require("node-redis-scan");

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
const PUSHER_CHANNEL = "claraify";
const SUBMIT_EVENT = "submit";
const DB_KEY = "demo";
const STYLE_KEY = "styles";
const PRODUCTION = process.env.NODE_ENV == "production";
const STAGING = process.env.NODE_ENV == "test";
var KEY_NUMBER = 0

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

app.get("/getall", async (_, res) => {
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();
    console.log("Connection to redis client established");

    res.json(await client.get(DB_KEY, (error, styles) => {
        if (error) console.error(error);
        if (styles != null) {
            return styles;
        }
    }));
});

// === Communication with chrome extension === //

app.get("/serve-styles", async (_, res) => {
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();
    console.log("Connection to redis client established");
    console.log("Serving styles from database...");

    client.lrange("styles", 0, -1, async (error, items) => {
        if (error) console.error(error);
        if (items != null) {
            console.log("Sending styles...");
            return res.json(JSON.parse(items));
        }
    })

    // res.json( await client.lrange('styles', 0, -1, (err, items) => {
    //     if (err) throw err
    //      console.log("retrieving styles...");
    //      return res.json(JSON.parse(items));
    //    }));          
});

// Anything that doesn't match the above, send back index.html
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname + BUILD_DIR + "index.html"))
})

app.post(`/${SUBMIT_EVENT}`, async (req, res) => {
    if (PRODUCTION || STAGING) {
        // send to pusher only in production (to be isolated when runnig locally)
        const payload = req.body;
        pusher.trigger(PUSHER_CHANNEL, SUBMIT_EVENT, payload);
        console.log("Submitting");
        res.send(payload);
    }
});

app.post("/set", async (req, res) => {
    const { data } = req.body;
    client = PRODUCTION || STAGING ? redis.createClient({ url: REDIS_URL }) : redis.createClient();
    await client.connect();
    console.log("Connection to redis client established");
    const style = JSON.stringify(data);
    console.log(style);
    client.lpush('styles', [style]);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
