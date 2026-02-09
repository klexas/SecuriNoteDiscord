import { Client } from "discord.js";
import DeployCommands from "./deployCommands";
import { Commands } from "./commands";
import { config } from "./config";

// HTTP client with necessary intents


const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("clientReady", () => {
  console.log("Ready");
});

await DeployCommands();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  console.log(`Received command: ${interaction.commandName}`);
  const { commandName } = interaction;
  console.log(JSON.stringify(Commands));
  if (Commands[commandName]) {
    console.log(`Executing command: ${commandName}`);
    await Commands[commandName].execute(interaction);
  }
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  console.log(`Presence updated for user ${newPresence.userId}: ${oldPresence?.status} -> ${newPresence.status}`);
});

client.login(config.DISCORD_TOKEN);