import { Client } from "discord.js-selfbot-v13";
// import config from './config.json'
import ready from "./listeners/ready.js";
import fs from "fs";
import messageCreate from "./listeners/messageCreate.js";

const config = JSON.parse(fs.readFileSync("config.json"));

config.accounts.forEach((account) => {
  const client = new Client({ checkUpdate: false });
  ready(client);
  messageCreate(client, account);
  client.login(account.token);
});
