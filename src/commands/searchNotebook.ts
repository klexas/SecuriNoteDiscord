import { ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { config } from "../config";
import type { INotebook } from "../models/INotebook";
import { decrypt } from "../utils/encryption";
import { UserServices } from "../utils/userServices";

class SearchNotebookCommand implements ICommand {
  public command = new SlashCommandBuilder()
    .setName("searchnotebook")
    .setDescription("Searches for a notebook by name.")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("The content you want to search for in the notebook")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("The name of the notebook to search for")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("key")
        .setDescription("The key of the notebook to search for")
        .setRequired(false)
    )

  public async execute(interaction: ChatInputCommandInteraction) {
    const searchQuery = interaction.options.getString("search", true);
    const notebookName = interaction.options.getString("name", false) || UserServices.getDefaultNotebookSettings(interaction.user.id)?.notebookId;
    const notebookKey = interaction.options.getString("key", false) || UserServices.getDefaultNotebookSettings(interaction.user.id)?.notebookKey;

    if (!notebookName || !notebookKey) {
      return interaction.reply("No notebook name or key provided, and no default notebook settings found for this user. Please provide a notebook name and key, or set default notebook settings using /setnotebooksettings.");
    }

    const response = await fetch(`${config.SECURINOTE_API_URL}/notebooks/${notebookName}`);
    if (!response.ok) {
      return interaction.reply(`Failed to retrieve notebook: ${response.statusText}`);
    }
    const notebookData = await response.json() as INotebook;
    const decryptedContent = await decrypt(notebookData.notebook.content, notebookKey);
    const contentLines = decryptedContent.split("\n");
    const matchingLines = contentLines.filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()));

    if (matchingLines.length === 0) {
      return interaction.reply(`No matching content found in notebook "${notebookName}".`);
    }
    if (matchingLines.length > 10) {
      return interaction.reply(`Found ${matchingLines.length} matching lines in notebook "${notebookName}", but it's too much to display.`);
    }
    await interaction.reply(`${matchingLines.join("\n")}`);
  }
}

export default new SearchNotebookCommand();