import { Message } from "discord.js";

const map = {
    "ğ": "g",
    "Ğ": "g",
    "ü": "u",
    "Ü": "u",
    "ş": "s",
    "Ş": "s",
    "ı": "i",
    "İ": "i",
    "ç": "c",
    "Ç": "c",
    "ö": "o",
    "Ö": "o",
}

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
export function standartText(text) {
    return text.replace(/[ğĞüÜİışŞöÖçÇ]/gi, c => map[c]).toLowerCase();
}

/**
 * @param {number} minutes
 * @param {number} seconds
 * @returns {number}
 */
 export function randomTime(minutes = 1, seconds) {
    if (seconds) return Math.random() * 1000 * seconds;
    return Math.random() * 60 * 1000 * minutes;
}


const botCodeRegex = new RegExp("^[a-zA-Z0-9şŞğĞıİüÜçÇöÖ]", "gi");
/**
 * 
 * @param {Message} message 
 */
export function filterText(message) {
    const content = message.content;
    const filters = [content.trim().length < 2, content.includes("@"), message.author.bot, !botCodeRegex.test(content[0])];
    if (filters.some(bool => bool)) return true;
    return false;
}