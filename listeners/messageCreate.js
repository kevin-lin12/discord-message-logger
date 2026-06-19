import { WebhookClient } from "discord.js-selfbot-v13";

export default (client, account) => {
  let routes = [];

  if (Array.isArray(account.routes)) {
    routes = account.routes;
  } else if (account.webhook && Array.isArray(account.channels)) {
    routes = [
      {
        channels: account.channels,
        webhook: account.webhook,
      },
    ];
  } else {
    console.error("Invalid account config:", account);
    return;
  }

  const normalizedRoutes = routes.map((route) => ({
    channels: route.channels,
    hook: new WebhookClient({ url: route.webhook }),
  }));

  client.on("messageCreate", async (message) => {
    for (const route of normalizedRoutes) {
      if (!route.channels.includes(message.channel.id)) {
        continue;
      }

      const attachments = [];
      let embeds = [];

      if (message.attachments.size > 0) {
        message.attachments.forEach((attach) => {
          attachments.push(attach.url);
        });
      }

      if (message.embeds.length > 0) {
        embeds = message.embeds;
      }

      const hookObj = {};

      if (message.content) {
        hookObj.content = message.content;
      }

      if (attachments.length > 0) {
        hookObj.files = attachments;
      }

      if (embeds.length > 0) {
        hookObj.embeds = embeds;
      }

      hookObj.username = message.author.username;
      hookObj.avatarURL = message.author.avatarURL();

      try {
        await route.hook.send(hookObj);
      } catch (err) {
        console.error("Webhook send failed:", err);
      }
    }
  });
};
