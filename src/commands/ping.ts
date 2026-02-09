import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";

class PingCommand implements ICommand {
  public command: SlashCommandBuilder = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  public async execute(interaction: CommandInteraction) {
    return interaction.reply("I'm here!");
  }
}

export default new PingCommand();