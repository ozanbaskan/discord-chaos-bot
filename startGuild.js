import { Guild } from "discord.js";
import { client } from "./client.js";
import { guildCollection } from "./db.js";
import { sendRandomMessageRepeat } from "./message.js";
import { playRandomVoiceRepeat } from "./voice.js";
import { filterText } from "./helpers.js";
import { switchVoicePlaceOfRandomUserRepeat } from "./switchPlace.js";
import { addARandomVoiceChannelRepeat, deleteARandomVoiceChannelRepeat } from "./channels.js";
import { guildCache, setGuildCache } from "./cache.js";

/**
 * 
 * @param {Guild} guild
 */
 export async function startGuild(guild) {
    try {
        const guildDoc = await guildCollection.findOne({_id: guild.id});
        if (!guildDoc) return await addGuild(guild);
        else setGuildCache(guildDoc, guild.id);
        await sendRandomMessageRepeat(client, guild, guildDoc.randomChat);
        await playRandomVoiceRepeat(client, guild, guildDoc.randomVoice);
        await switchVoicePlaceOfRandomUserRepeat(client, guild, guildDoc.randomSwitchVoicePlaceSeconds);
        await addARandomVoiceChannelRepeat(client, guild, guildDoc.randomVoiceAddSeconds);
        await deleteARandomVoiceChannelRepeat(client, guild, guildDoc.randomVoiceDeleteSeconds);
    } catch (error) {
        console.error(error, "guild start error");
    }
}
/**
 * 
 * @param {Guild} guild 
 * @returns 
 */
export async function addGuild(guild) {
    let totalMessages = 0;
    try {
        const guildDoc = await guildCollection.findOne({_id: guild.id});
        if (guildDoc) return setGuildCache(guildDoc, guild.id);
        const messageDict = {};
        for (const channel of guild.channels.cache.values()) {
          if (totalMessages++ > 10000) break;
          if (channel.isText()) {
            let message = (await channel.messages.fetch({limit: 1})).first();
            while (message) {
              const messages = await channel.messages.fetch({ limit: 100, before: message.id});
              for (const message_ of messages.values()) {
                if (message_.author.bot) continue;
                if (totalMessages++ > 10000) break;
                const content = message_.content;
                if (filterText(message_)) continue;
                messageDict[content.toLowerCase()] = true;
              }
              message = 0 < messages.size ? messages.at(messages.size - 1) : null;
            } 
          }
        }
        const chatData = Object.keys(messageDict);
        await guildCollection.insertOne({
          _id: guild.id,
          chatData,
        });
        guildCache.set(guild.id, { chatData });
      } catch (error) {
        console.error(error, "guild create error");
      }
}