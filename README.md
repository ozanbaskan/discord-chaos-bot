## Usage

You can get a free mongodb account.


### Env variables needed:
- TOKEN: Your discord bot's token
- MONGO_USER: Your mongodb account's username
- MONGO_PW: Your mongodb account's password

### Create a file named .env and add these values to it

Example:
```
TOKEN=example-token
MONGO_USER=example-user
MONGO_PW=example-password
```

You need to have cluster0 on your mongodb account, it is the default name for first cluster.

### Install and start:
```
npm install && node index.js
```

### Features

- You can read commands with typing ">>help" on discord chat
- Chaos mode just randomly switches discord user's voice chat channels for now
- You can add extra voice files inside voice folder to make discord also randomly play them