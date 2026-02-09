import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { encrypt, decrypt } from "../utils/encryption";
import { UserServices } from "../utils/userServices";
import type { INotebook } from "../models/INotebook";
import { config } from "../config";

class AddToNotebookCommand implements ICommand {
  public command = new SlashCommandBuilder()
    .setName("addtonotebook")
    .setDescription("Adds content to a notebook.")
    .addStringOption(option =>
      option
        .setName("content")
        .setDescription("The content you want to add to the notebook")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("name")    
        .setDescription("The name of the notebook to add to")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("key")
        .setDescription("The key of the notebook to add to")
        .setRequired(false)
    )

    public async execute(interaction: ChatInputCommandInteraction) {
    const contentToAdd = interaction.options.getString("content", true);
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
    const updatedContent = decryptedContent + "\n" + contentToAdd;
    const encryptedContent = await encrypt(updatedContent, notebookKey);
    const updateResponse = await fetch(`${config.SECURINOTE_API_URL}/notebooks/${notebookName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: encryptedContent
      })
    });
    if (!updateResponse.ok) {
        return interaction.reply(`Failed to update notebook: ${updateResponse.statusText}`);
    }
    await interaction.reply(`Content added to notebook "${notebookName}".`);
  }
}

export default new AddToNotebookCommand();