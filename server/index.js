const express = require("express");
const redis = require('redis');

// ==== retrieve env variables ====
require('dotenv').config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USER } = process.env;

const REDIS_URL=`redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`

// ==== end of retrieve env variables ====

const PORT = process.env.PORT || 4001;
const BUILD_DIR = '../client/build/'
const app = express();
const path = require('path')

app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, BUILD_DIR)))

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/getall", async (req, res) => {

    client = redis.createClient({ url: REDIS_URL });
    console.log("getall: checkpoint [1]");
    await client.connect();
    console.log("getall: checkpoint [2]");

    res.json(await client.get('demo', (error, styles) => {
        if (error) console.error(error);
        if (styles != null) {
            return styles;
        }
    }));
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + BUILD_DIR + 'index.html'))
})

app.post("/set", async (req, res) => {
    const { data } = req.body;
    client = redis.createClient({ url: REDIS_URL });
    console.log("set: checkpoint [1]");
    await client.connect();
    console.log("set: checkpoint [2]");
    // const {font, fontSize, bgColor} = req.body;
    console.log(data);
    client.set('demo', JSON.stringify(data));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
