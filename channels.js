import { Guild } from "discord.js";
import { guildCache, timeoutGuildCache } from "./cache.js";
import { guildCollection } from "./db.js";
import { randomTime } from "./helpers.js";
import { randomVoiceAddTimeouts, randomVoiceDeleteTimeouts } from "./timeouts.js";

/**
 * 
 * @param {Guild} guild 
 */
export async function deleteARandomVoiceChannel(guild) {
    try {
        const channels = [];

        for (const channel of guild.channels.cache.values()) 
            if (channel.isVoice()) 
                channels.push(channel);
                
        
        if (channels.length < 2) return;
        
        let channel = channels[Math.floor(Math.random() * channels.length)];
        let anotherChannel = channels[Math.floor(Math.random() * channels.length)];
        while (anotherChannel.id === channel.id) anotherChannel = channels[Math.floor(Math.random() * channels.length)];
        for (const member of channel.members.values()) await member.voice.setChannel(anotherChannel);
        await channel.delete();
    } catch (error) {
        console.error(error, "deleteARandomVoiceChannel error");
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {number} freq 
 */
 export async function deleteARandomVoiceChannelRepeat(client, guild, freq) {
    clearTimeout(randomVoiceDeleteTimeouts[guild.id]);
    if (!freq) return;
    await deleteARandomVoiceChannel(guild);
    randomVoiceDeleteTimeouts[guild.id] = setTimeout(deleteARandomVoiceChannelRepeat.bind(null, client, guild, freq), randomTime(0, freq));
};

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string} command 
 * @param {number} freq 
 * @returns 
 */
 export async function setRandomVoiceDeleteSeconds(client, message, command, freq) {
    try {
      const guild = message.guild || message;
      freq = freq ?? command.split(" ")?.[1]?.trim();
      const freqI = parseInt(freq);
      if (freqI !== 0 && !freqI) return;
      if (guildCache.has(guild.id)) {
        const guildData = guildCache.get(guild.id);
        guildData.randomVoiceDeleteSeconds = freqI;
      } else {
        const guildData = await guildCollection.findOne({_id: guild.id});
        guildData.randomVoiceDeleteSeconds = freqI;
        guildCache.set(guild.id, guildData);
        timeoutGuildCache(guild.id);
      }
      await guildCollection.findOneAndUpdate({_id: guild.id}, {
          $set: {
            randomVoiceDeleteSeconds: freqI
          }
      });
      await deleteARandomVoiceChannelRepeat(client, guild, freqI);
      message.reply && await message.reply("Done ✅");
    } catch (error) {
      console.error(error, "setRandomDeleteARandomVoiceChannel error");
      try {
        message.reply && await message.reply("Nope ❗");
      } catch (error) { }
    }
  }

  
/**
 * 
 * @param {Guild} guild 
 */
export async function addARandomVoiceChannel(guild) {
    try {
        let chatData = [];
        if (guildCache.has(guild.id)) chatData = guildCache.get(guild.id).chatData;
        else {
          const guildData = await guildCollection.findOne({_id: guild.id});
          chatData = guildData.chatData;
          guildCache.set(guild.id, guildData);
          timeoutGuildCache(guild.id);
        }
        let randomName = chatData[Math.floor(chatData.length * Math.random())];
        if (!randomName) randomName = "Embrace Chaos!";
        if (randomName.length > 100) randomName = randomName.slice(0, 100).split(" ")[0];
        await guild.channels.create(randomName, {
            type: 2,
        })
    } catch (error) {
        console.error(error, "addARandomVoiceChannel error");
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {number} freq 
 */
 export async function addARandomVoiceChannelRepeat(client, guild, freq) {
    clearTimeout(randomVoiceAddTimeouts[guild.id]);
    if (!freq) return;
    await addARandomVoiceChannel(guild);
    randomVoiceAddTimeouts[guild.id] = setTimeout(addARandomVoiceChannelRepeat.bind(null, client, guild, freq), randomTime(0, freq));
};

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string} command 
 * @param {number} freq 
 * @returns 
 */
 export async function setRandomAddVoiceSeconds(client, message, command, freq) {
    try {
      const guild = message.guild || message;
      freq = freq ?? command.split(" ")?.[1]?.trim();
      const freqI = parseInt(freq);
      if (freqI !== 0 && !freqI) return;
      if (guildCache.has(guild.id)) {
        const guildData = guildCache.get(guild.id);
        guildData.randomVoiceAddSeconds = freqI;
      } else {
        const guildData = await guildCollection.findOne({_id: guild.id});
        guildData.randomVoiceAddSeconds = freqI;
        guildCache.set(guild.id, guildData);
        timeoutGuildCache(guild.id);
      }
      await guildCollection.findOneAndUpdate({_id: guild.id}, {
          $set: {
            randomVoiceAddSeconds: freqI
          }
      });
      await addARandomVoiceChannelRepeat(client, guild, freqI);
      message.reply && await message.reply("Done ✅");
    } catch (error) {
      console.error(error, "setRandomDeleteARandomVoiceChannel error");
      try {
        message.reply && await message.reply("Nope ❗");
      } catch (error) { }
    }
  }