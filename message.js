import { randomTime, standartText } from "./helpers.js";
import { Client, Guild, Message } from "discord.js";
import { guildCollection } from "./db.js";
import { randomChatTimeouts } from "./timeouts.js";
import { client } from "./client.js";
import { addGuild } from "./startGuild.js";
import { guildCache, timeoutGuildCache } from "./cache.js";



/**
 * 
 * @param {Message} message 
 * @returns {Promise<string>} answer to message
 */
export async function messageContentAnswer(message) {
    const content = message.content;
    let guildData = {};
    if (guildCache.has(message.guildId)) guildData = guildCache.get(message.guildId);
    else {
        guildData = await guildCollection.findOne({ _id: message.guildId });
        guildCache.set(message.guildId, guildData);
        timeoutGuildCache(message.guildId);
    }
    if (!guildData) return await addGuild(message.guild);
    if (Math.random() >= parseFloat(guildData.replyActivity) && !message.mentions.users.some(user => user.id === client.user.id)) return;
    const chatData = guildData.chatData;
    if (!chatData.length) return "";
    const related = Math.round(Math.random() * 0.75);
    if (related) return findSimilar(content, chatData);
    return chatData[Math.floor(chatData.length * Math.random())];
}

/**
 * @param {Guild} guild
 * @returns {Promise<string>}
 */
export async function randomMessage(guild) {
    let allData = [];
    if (guildCache.has(guild.id)) allData = guildCache.get(guild.id).chatData;
    else {
      const guildData = await guildCollection.findOne({_id: guild.id});
      guildCache.set(guild.id, guildData);
      allData = guildData.chatData;
      timeoutGuildCache(guild.id);
    }
    return allData[Math.floor(allData.length * Math.random())]
};

/**
 * 
 * @param {Guild} guild 
 */
export async function sendRandomMessage(guild) {
    const allChannels = [];
    try {
      for (const [key, channel] of guild.channels.cache.entries()) {
        if (channel.isText()) allChannels.push(channel);
      }
      const channel = allChannels[Math.floor(allChannels.length * Math.random())];
      const content = await randomMessage(guild);
      channel && content && await channel.send(content);
    } catch (error) {
      console.error(error, "send random message error");
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {number} freq 
 */
export async function sendRandomMessageRepeat(client, guild, freq) {
    clearTimeout(randomChatTimeouts[guild.id]);
    if (!freq) return;
    await sendRandomMessage(guild);
    randomChatTimeouts[guild.id] = setTimeout(sendRandomMessageRepeat.bind(null, client, guild, freq), randomTime(freq));
};

/**
 * 
 * @param {string} text 
 * @param {string[]} data
 */
export function findSimilar(text, data) {
    const textWords = text.split(" ").map(w => standartText(w.trim()));
    const dataWords = data.map(text => text.split(" ").map(w => standartText(w.trim())));
    const similars = [];
    for (let i = 0; i < dataWords.length; i++) {
        const dataWord = dataWords[i];
        for (const textWord of textWords) if (dataWord.includes(textWord)) similars.push(data[i]);
    };
    return (similars.length && similars[Math.floor(similars.length * Math.random())]) || data[Math.floor(data.length * Math.random())];
}
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string} command 
 * @param {number} freq 
 * @returns 
 */
export async function setRandomChatMinutes(client, message, command, freq) {
  try {
    const guild = message.guild || message;
    freq = freq ?? command.split(" ")?.[1]?.trim();
    const freqI = parseInt(freq);
    if (freqI !== 0 && !freqI) return;
    if (guildCache.has(guild.id)) {
      const guildData = guildCache.get(guild.id);
      guildData.randomChat = freqI;
    } else {
      const guildData = await guildCollection.findOne({ _id: message.guildId });
      guildCache.set(message.guildId, guildData);
      guildData.randomChat = freqI;
      timeoutGuildCache(message.guildId);
    }
    await guildCollection.findOneAndUpdate({_id: guild.id}, {
        $set: {
          randomChat: freqI
        }
    });
    await sendRandomMessageRepeat(client, guild, freqI);
    message.reply && await message.reply("Done ✅");
  } catch (error) {
    console.error(error, "setRandomChatError");
    try {
      message.reply && await message.reply("Nope ❗");
    } catch (error) { }
  }
}

export async function setReplyActivity(client, message, command, freq) {
  try {
    const guild = message.guild || message;
    freq = freq ?? command.split(" ")?.[1]?.trim();
    let freqF = parseFloat(freq);
    if (freqF !== 0 && !freqF) return;
    if (freqF < 0) freqF = 0;
    if (freqF > 1) freqF = 1;
    if (guildCache.has(guild.id)) {
      const guildData = guildCache.get(guild.id);
      guildData.replyActivity = freqF;
    } else {
      const guildData = await guildCollection.findOne({ _id: guild.id});
      guildCache.set(guild.id, guildData);
      guildData.replyActivity = freqF;
      timeoutGuildCache(guild.id);
    }
    await guildCollection.findOneAndUpdate({_id: guild.id}, {
      $set: {
          replyActivity: freqF
      }
    });
    message.reply && await message.reply("Done ✅");
  } catch (error) {
    console.error(error, "setActivityError");
    try {
      message.reply && await message.reply("Nope ❗");
    } catch (error) { }
  }
}