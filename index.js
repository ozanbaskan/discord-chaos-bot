import { TOKEN } from './env.js';
import { client } from './client.js';
import { commands, returnRole } from './commands.js';
import { guildCollection } from './db.js';
import { handleCommands } from './handleCommands.js';
import { messageContentAnswer } from './message.js';
import { addGuild, startGuild } from './startGuild.js';
import { updateChatData } from './updateChatData.js';


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(">>help");
  client.guilds.cache.each(startGuild);
});

client.on("guildCreate", async function(guild) {
  await addGuild(guild);
})

client.on("guildDelete", async function(guild) {
  try {
    await guildCollection.deleteOne({_id: guild.id});
  } catch (error) {
    console.error(error, "guild delete error");
  }
})

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  const trimmedMessage = message.content.trimEnd();
  const command = trimmedMessage.split(" ")[0];
  if (commands[command]) {
    const role = returnRole(command);
    try {
      if (role !== "ALL" && !message.member.permissions.has(role)) return await message.reply("You have no right to do this!");
      return await handleCommands(trimmedMessage, client, message);
    } catch (error) {
      return console.error(error, "role error");
    }
  }

  try {
    const answer = await messageContentAnswer(message);
    if (answer) await message.reply(answer);
  } catch (error) {
    return console.error(error, "message answer error");
  }

  try {
    const shouldNotAddMessage = Math.round(Math.random() * 5);
    if (!shouldNotAddMessage) await updateChatData(message);
  } catch (error) {
    console.error(error, "message add error");
  }
});

(async () => {
  await client.login(TOKEN);
})();