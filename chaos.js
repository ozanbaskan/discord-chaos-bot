import { Message } from "discord.js";
import { client } from "./client.js";
import { setRandomSwitchVoicePlaceSeconds } from "./switchPlace.js";

const levels = {
    10: 6,
    9: 15,
    8: 30,
    7: 45,
    6: 60,
    5: 120,
    4: 240,
    3: 480,
    2: 960,
    1: 1440,
    0: 0,
}

/**
 * 
 * @param {Message} message 
 * @param {number} level 
 */
export async function setChaos(message, command) {
    try {
        const guild = message.guild;
        const level = parseInt(command.split(" ")?.[1]?.trim());
        const levelValid = new Array(11).fill(null).map((n,i) => i).includes(level);
        if (!levelValid) return;
        await setRandomSwitchVoicePlaceSeconds(client, guild, "", levels[level]);
        // await setRandomVoiceDeleteSeconds(client, guild, "", levels[level]);
        // await setRandomAddVoiceSeconds(client, guild, "", levels[level]);
        message.reply && await message.reply("Done ✅");
    } catch (error) {
      console.error(error, "setRandomChatError");
      try {
        message.reply && await message.reply("Nope ❗");
      } catch (error) { }
    }
}