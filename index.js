require('dotenv').config()

const { Intents, Client, Permissions } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.login(process.env.BOT_TOKEN)

client.once("ready", () => {
    console.log("ready");

})

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return false;

    if (msg.content == "spam" && msg.type == "REPLY") {

        // to not mess up with other server's channels at the same time
        let guildId = msg.guildId;

        try {
            // only allowing admins to mark spam
            if (msg.member.permissions.has([Permissions.FLAGS.KICK_MEMBER])) {

                spamId = msg.reference.messageId;

                msg.channel.messages.fetch(spamId).then(val => {
                    let spamMsg = val.content;

                    let channels = client.channels.cache;

                    for (const channelObj of channels) {
                        channelId = channelObj[0];

                        // check if the channel is in the same server
                        if (channelObj[1].guildId == guildId) {
                            channel = client.channels.resolve(channelId)
                            if (channel.isText()) {
                                cache = client.channels.cache.get(channelId)
                                cache.messages.fetch({ limit: 40 }).then(
                                    async msg => {
                                        msg.each(messg => {
                                            if (messg.content == spamMsg) {
                                                messg.delete();
                                            }
                                        })
                                    }
                                )
                            }
                        }
                    }
                });
            }
        }
        catch {
            console.log("Not admin");
        }
    }
});