import express from 'express';
import DotEnv from 'dotenv';
import cors from 'cors';
import * as twitter from './twitter';
import * as ipAddress from './ipAddress';
import { isOriginAllowed } from './utils/cors';

// dotenv variables now available
DotEnv.config();
twitter.init();

// Our Express APP config
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.set('port', process.env.PORT || 3001);

// API Endpoints
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
      <title>pi-api</title>
      </head>
      <body>
        <h1>Available endpoints</h1>
        <ul>
          <li>GET /ipv4</li>
          <li>GET /twitter/tweets/:userId</li>
          <li>GET /twitter/legacy-tweets/:userId</li>
          <li>GET /twitter/legacy-tweets (requires a ?user=query)</li>
        </ul>
      </body>
    </html>
  `);
});
app.get('/ipv4', ipAddress.getPublicV4);
app.get('/twitter/legacy-tweets/:userId', twitter.getUserTweetsLegacy);
app.get('/twitter/legacy-tweets', twitter.getUserTweetsLegacy);
app.get('/twitter/tweets/:userId', twitter.getUserTweets);
// app.get('/twitter/images/:userId', twitter.getUserImages);

// export our app
export default app;
