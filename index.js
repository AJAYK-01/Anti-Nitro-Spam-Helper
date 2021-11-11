require("dotenv").config();

const { Intents, Client, Permissions } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Ready");
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return false;
  if (msg.content == "spam" && msg.type == "REPLY") {
    try {
      // Only allow “admins” to mark message as spam
      if (msg.member.permissions.has([Permissions.FLAGS.KICK_MEMBER])) {
        let spamId = msg.reference.messageId;

        msg.channel.messages.fetch(spamId).then((m) => {
          // RegEx exp. from: geeksforgeeks.org/how-to-validate-url-using-regular-expression-in-javascript
          let spamMsg = m.content,
            channels = client.channels.cache,
            regex =
              /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
            url = spamMsg.match(regex);

          for (const channelObj of channels) {
            channelId = channelObj[0];
            channel = client.channels.resolve(channelId);
            if (channel.isText()) {
              cache = client.channels.cache.get(channelId);
              cache.messages.fetch({ limit: 40 }).then(async (msg) => {
                msg.each((m) => {
                  if (m.content == spamMsg || m.content.includes(url))
                    /* If the message fetched is equal to the msg marked as spam AND contains the same link
                    from it, deletes the message. */
                    m.delete();
                });
              });
            }
          }
        });
      } else
        console.log(
          `${msg.author.tag} tried flagging a message as spam without the “KICK_MEMBER” perm.`
        );

      msg.delete();
    } catch (err) {
      console.error(err);
    }
  }
});

client.login(process.env.BOT_TOKEN);
