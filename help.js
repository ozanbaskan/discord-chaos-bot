import { Client, Message } from "discord.js";
import { commands } from "./commands.js";

const commandsFormatted = Object.keys(commands).map(com => com + ": " + commands[com]).join("\n");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
export async function helpResponse(client, message) {
    message.reply(commandsFormatted)
}