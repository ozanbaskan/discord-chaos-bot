import { Message } from "discord.js";
import { guildCollection } from "./db.js";
import { filterText } from "./helpers.js";

/**
 * 
 * @param {Message} message
 */
export async function updateChatData(message) {
    const content = message.content;
    const guild = message.guild;
    if (filterText(message)) return;
    console.log("saving: ", content, "->", guild.name);
    const guildDoc = await guildCollection.findOne({
        _id: guild.id
    });
    guildDoc.chatData.length = Math.min(guildDoc.chatData.length, 50000);
    guildCollection.findOneAndUpdate({_id: guild.id}, {
        $push: {
            chatData: content
        }
    }, {
        upsert: true
    }, function (err, doc) {
        if (err) console.error(err, "error updating chat data");
    });
}