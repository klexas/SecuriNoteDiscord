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

client.login(config.DISCORD_TOKEN);

Bun.serve({
  port: 5555,
  fetch(req) { 
    return new Response("Hello world!");
  },
  routes: {
    "/discord": {
      POST(data:any) {
        console.log("Received a POST request at /discord");
        return new Response("Hello world!");
      },
        GET() {
        console.log("Received a GET request at /discord");
        return new Response("Hello world!");
        }
    },
  },
});