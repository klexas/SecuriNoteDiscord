import { REST, Routes } from "discord.js";
import { config } from "./config";
import { Commands } from "./commands";

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

async function DeployCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID),
      {
        body: Object.values(Commands).map((command) => command.command.toJSON()),
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

export default DeployCommands;