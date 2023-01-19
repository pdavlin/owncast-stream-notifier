import { serve } from "https://deno.land/std@0.147.0/http/server.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { OwncastWebhook } from "./owncast-webhooks.ts";

const configData = await load();
const SLACK_WEBHOOK_ID = configData["SLACK_WEBHOOK_ID"];
const SLACK_FITNESS_ID = configData["SLACK_FITNESS_ID"];
const DISCORD_CHANNEL_ID = configData["DISCORD_CHANNEL_ID"];

serve(handler, { port: 80 });

// discordPost("I just got restarted--ready to receive messages.");

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  console.log(`${req.method} ${url.pathname}`);
  if (url.pathname === "/v1/stream-notifier/webhook") {
    if (req.method.toLowerCase() === "post") {
      const owncastHook: OwncastWebhook = JSON.parse(await req.text());
      const streamTitle: string = owncastHook.eventData.streamTitle;
      const message =
        "https://stream.davlin.io is online streaming: " + streamTitle;
      if (["zrl", "zwift"].includes(streamTitle.split(" ")[0].toLowerCase())) {
        slackPost(message, "fitness");
      } else {
        slackPost(message, "gaming");
      }
      // discordPost(message);
      return new Response(null, {
        status: 204,
      });
    } else {
      return new Response(
        JSON.stringify({ statusCode: 405, description: "Method Not Allowed" }),
        {
          status: 405,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }
  } else if (url.pathname === "/v1/stream-notifier/health") {
    return new Response("OK", {
      status: 200,
      headers: {
        "content-type": "text/plain",
      },
    });
  }
  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain",
    },
  });
}

/**
 * Sends a message to Discord chat.
 * @param message text to send to Discord
 */
function discordPost(message: string) {
  // HTTP request config
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  };

  fetch(
    `https://discord.com/api/webhooks/${DISCORD_CHANNEL_ID}`,
    config
  );
}

/**
 * Sends a message to Discord chat.
 * @param message text to send to Discord
 */
async function slackPost(message: string, streamType: "fitness" | "gaming") {
  const urls = (streamType === "fitness" ? SLACK_FITNESS_ID : SLACK_WEBHOOK_ID)
    .split(",")
    .map((key) => `https://hooks.slack.com/services/${key}`);

  // HTTP request config
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
    }),
  };
  await urls.forEach(async (url) => {
    await fetch(url, config);
  });
}
