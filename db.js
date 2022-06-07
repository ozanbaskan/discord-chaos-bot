import { MongoClient } from 'mongodb';
import { MONGO_USER, MONGO_PW } from './env.js';
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.b5yq0.mongodb.net/?retryWrites=true&w=majority`;
export const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoClient.connect();
mongoClient.on("connectionReady", function(event) {
    console.log("db ok")
})
export const guildCollection = mongoClient.db("discord-tris-merigold").collection("guild");