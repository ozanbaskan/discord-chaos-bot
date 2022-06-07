import { Channel } from "discord.js";

/**
 * 
 * @param {Channel} channel
 */
export async function clearTextChannel(channel) {
    if (!channel.isText()) return;
    try {
        await channel.clone();
        await channel.delete();
    } catch (error) {
        console.error(error, "channel clear error")
    }
    
}