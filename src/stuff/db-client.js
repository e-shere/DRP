import { createClient } from 'redis';

const { endpointUri, password } = require('.').redis;

const redisClient = redis.createClient(`redis://${endpointUri}`, { password });

module.exports = redisClient;