import { createHmac, timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { Err, Ok } from "neverthrow";
import type { Result } from "neverthrow";
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

const validateSignatureHeader: (req: NextApiRequest) => Result<boolean, Error> =
  ({ headers, body }) => {
    const signature = headers["x-twitter-webhooks-signature"];
    if (Array.isArray(signature) || signature === undefined) {
      return new Err(Error("Incorrect type of signature in header."));
    } else {
      const calculatedSignature = `sha256=${createHmac(
        "sha256",
        TWITTER_BOT_API_SECRET_KEY
      )
        .update(JSON.stringify(body))
        .digest("base64")}`;

      return new Ok(
        timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(calculatedSignature)
        )
      );
    }
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
  // Source label returned by v1.1 API seems to be an <a> tag.
  const isTweetedViaSwitch =
    source ===
    '<a href="https://www.nintendo.com/countryselector" rel="nofollow">Nintendo Switch Share</a>';
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
      const isSentFromTwitter = validateSignatureHeader(req);

      if (isSentFromTwitter.isErr()) {
        // Signature was either malformed or absent.
        res.status(400).json({ message: isSentFromTwitter.error.message });
        break;
      }

      if (!isSentFromTwitter.value) {
        // Signature was present, but an invalid one.
        res.status(400).json({ message: "Invalid signature in header." });
        break;
      }

      if (!isAtMentionPayload(body)) {
        // Webhook was fired due to other activities.
        res.status(400).json({ message: "Not an @mention payload." });
        break;
      }

      const atMention = body.tweet_create_events[0];
      if (shouldBeSentToCloudVision(atMention)) {
        // Picture(s) of RFA were shared via Nintendo Switch, so they'll be sent to
        // Cloud Vison API.
        res.status(200).json({ message: "Related to Ring Fit Adventure." });
      } else {
        // @ringfitdiary got mentioned, but the tweet was neither related to RFA result
        // nor tweeted via Nintendo Switch.
        res.status(400).json({ message: "Not related to Ring Fit Adventure." });
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
