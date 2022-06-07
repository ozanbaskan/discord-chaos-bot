import { Client, Message } from "discord.js";
import { setChaos } from "./chaos.js";
import { clearTextChannel } from "./clearTextChannel.js";
import { helpResponse } from "./help.js";
import { setRandomChatMinutes, setReplyActivity } from "./message.js";
import { setRandomVoiceMinutes } from "./voice.js";

/**
 * 
 * @param {string} command 
 * @param {Client} client 
 * @param {Message} message 
 */
 export async function handleCommands(trimmedMessage, client, message) {
    if (trimmedMessage === ">>help") await helpResponse(client, message);
    if (trimmedMessage === ">>purgeChat") await clearTextChannel(message.channel);
    if (trimmedMessage.split(" ")[0] === ">>setReplyActivity") await setReplyActivity(client, message, trimmedMessage);
    if (trimmedMessage.split(" ")[0] === ">>setRandomChatMinutes") await setRandomChatMinutes(client, message, trimmedMessage);
    if (trimmedMessage.split(" ")[0] === ">>setRandomVoiceMinutes") await setRandomVoiceMinutes(client, message, trimmedMessage);
    if (trimmedMessage.split(" ")[0] === ">>setChaosLevel") await setChaos(message, trimmedMessage);
}