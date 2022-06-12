const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const Pusher = require("pusher");
const redis = require("redis");

// ==== retrieve env variables ====
require("dotenv").config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USER } = process.env;
const REDIS_URL = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
const pusher = new Pusher({
    appId: process.env.PUSHER_ID,
    key: process.env.REACT_APP_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

// ==== end of retrieve env variables ====

const PORT = process.env.PORT || 4001;
const BUILD_DIR = "../client/build/"

const app = express();
const path = require("path")

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, BUILD_DIR)))

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/getall", async (req, res) => {
    client = redis.createClient({ url: REDIS_URL });
    await client.connect();
    console.log("Connection to redis client established");

    res.json(await client.get("demo", (error, styles) => {
        if (error) console.error(error);
        if (styles != null) {
            return styles;
        }
    }));
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + BUILD_DIR + "index.html"))
})

app.post("/submit", async (req, res) => {
    const payload = req.body;
    pusher.trigger("claraify", "submit", payload);
    res.send(payload);
});

app.post("/set", async (req, res) => {
    const { data } = req.body;
    client = redis.createClient({ url: REDIS_URL });
    await client.connect();
    console.log("Connection to redis client established");
    console.log(data);
    client.set("demo", JSON.stringify(data));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
