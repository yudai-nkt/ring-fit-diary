import { createHmac } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import type { TweetV1 } from "twitter-api-v2";

type AtMentionPayLoad = {
  for_user_id: string;
  user_has_blocked: boolean;
  tweet_create_events: [TweetV1];
};

const TWITTER_BOT_API_SECRET_KEY = process.env.TWITTER_BOT_API_SECRET_KEY ?? "";

/**
 * Type guard for `AtMentionPayload`. Technically incorrect but practically OK
 * as long as Twitter Account Activity API is functioning.
 */
const isAtMentionPayload = (arg: unknown): arg is AtMentionPayLoad => {
  const isObject = (arg: unknown): arg is Record<string, unknown> => {
    return typeof arg === "object" && arg != null;
  };
  const keysOfAtMentionPayload = [
    "for_user_id",
    "user_has_blocked",
    "tweet_create_events",
  ];

  return (
    isObject(arg) &&
    Object.keys(arg).every((key) => keysOfAtMentionPayload.includes(key))
  );
};

/**
 * Returns whether or not media attached to a tweet should be processed with Cloud Vision API.
 * True if all the conditions below are met and false otherwise.
 * - the tweet contains a hashtag #RingFitAdventure
 * - the tweet is tweeted via Switch's share feature
 * - pictures are attached to the tweet
 */
const shouldBeSentToCloudVision: (tweet: TweetV1) => boolean = (tweet) => {
  const {
    source,
    entities: { hashtags, media },
  } = tweet;
  const isRelatedToRFA =
    Array.isArray(hashtags) &&
    hashtags.map(({ text }) => text).includes("RingFitAdventure");
  const isTweetedViaSwitch = source === "Nintendo Switch Share";
  const ifContainPictures = Array.isArray(media) && media[0].type === "photo";
  return isRelatedToRFA && isTweetedViaSwitch && ifContainPictures;
};

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  const { method, body } = req;
  switch (method) {
    case "GET": {
      // GET request is a CRC validation.
      const crcToken = req.query.crc_token;
      if (!Array.isArray(crcToken)) {
        const hmac = createHmac("sha256", TWITTER_BOT_API_SECRET_KEY)
          .update(crcToken)
          .digest("base64");
        res.status(200).json({ response_token: `sha256=${hmac}` });
      } else {
        res.status(400).send("Invalid CRC token.");
      }
      break;
    }
    case "POST": {
      // POST request is an account activity.
      if (isAtMentionPayload(body)) {
        const atMention = body.tweet_create_events[0];
        if (shouldBeSentToCloudVision(atMention)) {
          res.status(200).json({ message: "Related to Ring Fit Adventure." });
        } else {
          res
            .status(400)
            .json({ message: "Not related to Ring Fit Adventure." });
        }
      } else {
        res.status(400).json({ message: "Not an @mention payload." });
      }
      break;
    }
    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${method} not allowed.` });
    }
  }
};

export default handler;
