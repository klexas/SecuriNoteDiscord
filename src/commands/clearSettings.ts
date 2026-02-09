import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { UserServices } from "../utils/userServices";

class ClearSettingsCommand implements ICommand {
  public command = new SlashCommandBuilder()
    .setName("clearsettings")
    .setDescription("Clears the default notebook settings for the user");

  public async execute(interaction: ChatInputCommandInteraction) {
    const userId = interaction.user.id;
    await UserServices.clearDefaultNotebookSettings(userId);
    await interaction.reply("Your default notebook settings have been cleared.");
  }
}

export default new ClearSettingsCommand();