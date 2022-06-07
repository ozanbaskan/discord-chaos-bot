import fs from "fs";

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { Client, Guild } from "discord.js";
import { randomTime } from "./helpers.js";
import { randomVoiceTimeouts } from "./timeouts.js";
import { guildCollection } from "./db.js";


const voiceFiles = fs.readdirSync("voice");
const randomVoicePath = () => voiceFiles[Math.floor(voiceFiles.length * Math.random())];
/**
 * 
 * @param {Client} client 
 * @param {Guild} guild
 */
async function playRandomVoice(client, guild) {
      const channels = [];
      for (const [key, channel] of guild.channels.cache.entries()) {
        if (channel.isVoice() && channel.members.size && channel.joinable) {
            for (const [id, key] of channel.members.entries())
            if (id === client.user.id) return;
            channels.push(channel);
        }
      }
      const channel = channels[Math.floor(channels.length * Math.random())];

      if (channel && channel.isVoice() && channel.members.size) {
        let connection;
        try {
          const voicePlayer = createAudioPlayer();
          connection = joinVoiceChannel({
              channelId: channel.id,
              guildId: guild.id,
              selfDeaf: false,
              selfMute: false,
              adapterCreator: guild.voiceAdapterCreator
          });
          voicePlayer.on("stateChange", function(oldState, newState) {
            if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
              voicePlayer.removeAllListeners("stateChange");
              connection.destroy();
            }
          })
          await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
          const resource = createAudioResource("./voice/" + randomVoicePath(), {
            inputType: StreamType.Arbitrary
          });
          voicePlayer.play(resource);
          await entersState(voicePlayer, AudioPlayerStatus.Playing, 5e3);
          connection.subscribe(voicePlayer);
        } catch (error) {
          try {
            connection && connection.destroy();
          } catch (error) {
            console.error(error, "random voice player connection destroy error");
          }
          console.error(error, "random voice player error");
        }
      }
}

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 * @param {number} freq 
 */
 export async function playRandomVoiceRepeat(client, guild, freq) {
    clearTimeout(randomVoiceTimeouts[guild.id]);
    if (!freq) return;
    await playRandomVoice(client, guild);
    randomVoiceTimeouts[guild.id] = setTimeout(playRandomVoiceRepeat.bind(null, client, guild, freq), randomTime(freq));
};

export async function setRandomVoiceMinutes(client, message, command, freq) {
  try {
    const guild = message.guild || message;
    freq = freq ?? command.split(" ")?.[1]?.trim();
    const freqI = parseInt(freq);
    if (freqI !== 0 && !freqI) return;
    await guildCollection.findOneAndUpdate({_id: guild.id}, {
        $set: {
          randomVoice: freqI
        }
    });
    await playRandomVoiceRepeat(client, guild, freqI);
    message.reply && await message.reply("Done ✅");
  } catch (error) {
    console.error(error, "setRandomVoiceMinutesError");
    try {
      message.reply && await message.reply("Nope ❗");
    } catch (error) { }
  }
}