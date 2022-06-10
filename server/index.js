const express = require("express");
const redis = require('redis');

// ==== retrieve env variables ====
require('dotenv').config();

const sanitizeRedisUrl = url => url.replace(/^(redis\:\/\/)/, '');

const { REDIS_ENDPOINT_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const endpointUri = REDIS_ENDPOINT_URI
    ? sanitizeRedisUrl(REDIS_ENDPOINT_URI)
    : `${sanitizeRedisUrl(REDIS_HOST)}:${REDIS_PORT}`;

const password = REDIS_PASSWORD || undefined

// ==== end of retrieve env variables ====

const PORT = 3001; // process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const client = redis.createClient();

app.get("/all", async (req, res) => {
    console.log("I'm here");
    await client.connect();
    console.log("But not here");
    client.get('demo', (error, styles) => {
        if (error) console.error(error)
        if (styles != null) {
            return res.json(JSON.parse(styles))
        }
    })
    // res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
