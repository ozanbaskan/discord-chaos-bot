export const guildCache = new Map();
export const guildCacheTimeouts = {};

export function timeoutGuildCache(guildId) {
    clearTimeout(guildCacheTimeouts[guildId]);
    guildCacheTimeouts[guildId] = setTimeout(function() {
        guildCache.delete(guildId);
    }, 60 * 1000 * 3);
};