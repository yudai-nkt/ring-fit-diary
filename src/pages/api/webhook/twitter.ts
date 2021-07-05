import { createHmac } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

const TWITTER_BOT_API_SECRET_KEY = process.env.TWITTER_BOT_API_SECRET_KEY ?? "";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
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
      // To be implemented.
      break;
    }
    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${method} not allowed.` });
    }
  }
};

export default handler;
