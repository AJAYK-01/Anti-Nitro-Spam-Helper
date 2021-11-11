require("dotenv").config();

const { Intents, Client, Permissions } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("ready");
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return false;

  if (msg.content.toLowerCase() == "spam" && msg.type == "REPLY") {

    // to not mess up with other server's channels at the same time
    let guildId = msg.guildId;

    try {
      // only allowing admins to mark spam
      if (msg.member.permissions.has([Permissions.FLAGS.KICK_MEMBER])) {

        spamId = msg.reference.messageId;

        msg.channel.messages.fetch(spamId).then(m => {
          let spamMsg = m.content

          let channels = client.channels.cache

          let regex =
            /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
            url = spamMsg.match(regex);

          for (const channelObj of channels) {
            channelId = channelObj[0];


            // check if the channel is in the same server
            if (channelObj[1].guildId == guildId) {
              channel = client.channels.resolve(channelId)
              if (channel.isText()) {
                cache = client.channels.cache.get(channelId)
                cache.messages.fetch({ limit: 40 }).then(async (msg) => {
                  msg.each((m) => {
                    if (m.content == spamMsg || m.content.includes(url))
                      /* If the message fetched is equal to the msg marked as spam AND contains the same link
                      from it, deletes the message. */
                      m.delete();
                  });
                }
                ).catch(err => {
                  console.log("private channel probably " + err)
                })
              }
            }
          }

        });
      }
    }
    catch (err) {
      console.error("Probably not Admin " + err);
    }
  }
});

client.login(process.env.BOT_TOKEN);
