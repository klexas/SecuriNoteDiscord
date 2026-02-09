import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { UserServices } from "../utils/userServices";

class SetNotebookSettingsCommand implements ICommand {
  public command = new SlashCommandBuilder()
    .setName("setnotebooksettings")
    .setDescription("NOTE: This will store the notebook ID and key in plaintext in the browser's local storage")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("The name of the notebook to retrieve")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("key")
        .setDescription("The key of the notebook to retrieve")
        .setRequired(true)
    )

    public async execute(interaction: ChatInputCommandInteraction) {
        const notebookName = interaction.options.getString("name", true);
        const notebookKey = interaction.options.getString("key", true);
        
        console.log(`User ${interaction.user.tag} is setting default notebook settings to notebook "${notebookName}" with key "${notebookKey}"`);
        UserServices.setDefaultNotebookSettings(interaction.user.id, notebookName, notebookKey);
        await interaction.reply(`Default notebook settings have been updated for notebook "${notebookName}" for the user "${interaction.user.username}".`);
    }
}

export default new SetNotebookSettingsCommand();