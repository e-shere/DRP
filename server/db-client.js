require('dotenv').config();

const sanitizeRedisUrl = url => url.replace(/^(redis\:\/\/)/, '');

const { REDIS_ENDPOINT_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const endpointUri = REDIS_ENDPOINT_URI
    ? sanitizeRedisUrl(REDIS_ENDPOINT_URI)
    : `${sanitizeRedisUrl(REDIS_HOST)}:${REDIS_PORT}`;

const password = REDIS_PASSWORD || undefined

module.exports = {endpointUri, password}
