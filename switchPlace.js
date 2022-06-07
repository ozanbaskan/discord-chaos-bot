import { Guild } from "discord.js";
import { guildCollection } from "./db.js";
import { randomTime } from "./helpers.js";
import { randomSwitchTimeouts } from "./timeouts.js";

/**
 * 
 * @param {Guild} guild 
 */
export async function switchVoicePlaceOfRandomUser(guild) {
    try {
        const channels = [];
        const allChannels = [];
        const members = [];

        for (const channel of guild.channels.cache.values()) 
            if (channel.isVoice()) {
                allChannels.push(channel);
                if (channel.members.size) channels.push(channel);
            }
        
        if (allChannels.length < 2 || channels.length < 1) return;
        
        let channel = channels[Math.floor(Math.random() * channels.length)];
        let anotherChannel = allChannels[Math.floor(Math.random() * allChannels.length)];
        while (channel.id === anotherChannel.id) anotherChannel = allChannels[Math.floor(Math.random() * allChannels.length)];

        for (const member of channel.members.values()) members.push(member);

        const member = members[Math.floor(Math.random() * members.length)];

        await member.voice.setChannel(anotherChannel);
    } catch (error) {
        console.error(error, "switchVoicePlaceOfRandomUser error");
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {number} freq 
 */
 export async function switchVoicePlaceOfRandomUserRepeat(client, guild, freq) {
    clearTimeout(randomSwitchTimeouts[guild.id]);
    if (!freq) return;
    await switchVoicePlaceOfRandomUser(guild);
    randomSwitchTimeouts[guild.id] = setTimeout(switchVoicePlaceOfRandomUserRepeat.bind(null, client, guild, freq), randomTime(0, freq));
};

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string} command 
 * @param {number} freq 
 * @returns 
 */
 export async function setRandomSwitchVoicePlaceSeconds(client, message, command, freq) {
    try {
      const guild = message.guild || message;
      freq = freq ?? command.split(" ")?.[1]?.trim();
      const freqI = parseInt(freq);
      if (freqI !== 0 && !freqI) return;
      await guildCollection.findOneAndUpdate({_id: guild.id}, {
          $set: {
            randomSwitchVoicePlaceSeconds: freqI
          }
      });
      await switchVoicePlaceOfRandomUserRepeat(client, guild, freqI);
      message.reply && await message.reply("Done ✅");
    } catch (error) {
      console.error(error, "setRandomSwitchVoicePlaceMinutes error");
      try {
        message.reply && await message.reply("Nope ❗");
      } catch (error) { }
    }
  }