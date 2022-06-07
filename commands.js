export const commands = {
     ">>purgeChat": "Clones the chat and then removes it.",
     ">>help": "Shows all commands and functionalities.",
     ">>setRandomChatMinutes": "Sets period of random messages bot will send in minutes, 0 means no message",
     ">>setRandomVoiceMinutes": "Sets period of random voices bot will join and speak in minutes, 0 means no voice",
     ">>setReplyActivity": "Sets period of random replies bot will give, between 0 and 1",
     ">>setChaosLevel": "Sets chaos mode to a level, between 0 and 10"
};

export const ADMINISTRATOR = {
    ">>purgeChat": "Clones the chat and then removes it.",
    ">>setRandomChatMinutes": "Sets period of random messages bot will send in minutes, 0 means no message",
    ">>setRandomVoiceMinutes": "Sets period of random voices bot will join and speak in minutes, 0 means no voice",
    ">>setReplyActivity": "Sets period of random replies bot will give, between 0 and 1",
    ">>setChaosLevel": "Sets chaos mode to a level, between 0 and 10"
};

export const ALL = {
    ">>help": "Shows all commands and functionalities."
};


export function returnRole(command) {
    if (ADMINISTRATOR[command]) return "ADMINISTRATOR";
    if (ALL[command]) return "ALL";
}
