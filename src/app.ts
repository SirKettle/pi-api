import express from 'express';
import DotEnv from 'dotenv';
import * as twitter from './twitter';
import * as ipAddress from './ipAddress';

// dotenv variables now available
DotEnv.config();
twitter.init();

// Our Express APP config
const app = express();
app.set('port', process.env.PORT || 3001);

// API Endpoints
app.get('/', (req, res) => {
  res.send(`
    Available endpoints:

    GET /ipv4
    GET /tweets/:userId
  `);
});
app.get('/ipv4', ipAddress.getPublicV4);
app.get('/tweets/:userId', twitter.getUserTweets);

// export our app
export default app;
