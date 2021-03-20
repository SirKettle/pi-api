import { Request, Response } from 'express';
import TwitterClient from 'twitter';
import { compose, concat, last, map, pathOr, prop, propEq, uniq, uniqBy } from 'ramda';

let twitterClient: TwitterClient;

export const init = () => {
  const twitterCreds = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  };

  console.log('Twitter creds loaded from env vars');
  console.log(twitterCreds);
  twitterClient = new TwitterClient(twitterCreds);
};

const intOr = (stringInt: any, or: number = 0): number => {
  const int = parseInt(stringInt);
  if (isNaN(int)) {
    return or;
  }
  return int;
};

interface IMedia {
  media_url: string;
  media_url_https: string;
  sizes: any;
  type: string;
}

const mapMedia = (m: IMedia) => ({
  src: m.media_url,
  srcHttps: m.media_url_https,
  width: m.sizes?.small?.w || 100,
  height: m.sizes?.small?.h || 100,
});

type TMedia = ReturnType<typeof mapMedia>;

interface ITweet {
  [key: string]: string;
  created_at: string;
  text?: string;
  full_text?: string;
}

interface IDecoratedTweet {
  createdAtIso: string;
  text: string;
  url?: string | null;
  hashTags: string[];
  images: TMedia[];
  raw: ITweet;
}

const getTweetImages = (tweet: ITweet): TMedia[] => {
  const extraMedia: IMedia[] = pathOr([], ['extended_entities', 'media'])(tweet);
  const media: IMedia[] = pathOr([], ['entities', 'media'])(tweet);
  const photos: IMedia[] = media.concat(extraMedia).filter(propEq('type', 'photo'));
  const formatted: TMedia[] = map(mapMedia)(photos);
  return uniqBy<TMedia, string>(prop('src'), formatted);
};

export const getHashTags = (tweet: ITweet): string[] => {
  const tags = pathOr([], ['entities', 'hashtags'])(tweet);
  const extra = pathOr([], ['extended_entities', 'hashtags'])(tweet);
  const allTags = concat(tags, extra);
  return compose(uniq, map<unknown, string>(prop<string>('text')))(allTags);
};

export const getUserTweets = (req: Request, res: Response) => {
  const tweetCount = intOr(req.query.count, 20);

  const requestParams = {
    screen_name: req.params.userId,
    count: tweetCount,
    tweet_mode: 'extended', // this returns the full_text prop - not text
  };

  console.log(requestParams);

  twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
    if (!error) {
      console.log(tweets.map((t: ITweet) => t.created_at));

      const data = tweets
        .map((t: ITweet): IDecoratedTweet | undefined => {
          const tweetText = t.full_text || t.text;
          const textParts = (tweetText || '').split(' ');
          if (textParts.length > 0) {
            const maybeUrl = last(textParts);
            let url = null;
            if (maybeUrl.startsWith('http')) {
              url = textParts.pop();
            }
            const text = textParts.join(' ');
            return {
              // our calculated fields
              createdAtIso: new Date(t.created_at).toISOString(),
              text,
              url,
              hashTags: getHashTags(t),
              images: getTweetImages(t),
              // raw tweet data from twitter api
              raw: {
                ...t,
              },
            };
          }
          return;
        })
        .filter((t?: IDecoratedTweet) => !!t);

      res.send({
        tweetCount,
        twitterUserId: req.params.userId,
        data,
      });
    } else {
      console.log(error);
      res.status(401);
      res.send({
        error,
      });
    }
  });
};
