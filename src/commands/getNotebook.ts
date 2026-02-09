import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { config } from "../config";
import type { INotebook } from "../models/INotebook";
import { decrypt } from "../utils/encryption";

class GetNotebookCommand implements ICommand {
  public command = new SlashCommandBuilder()
    .setName("getnotebook")
    .setDescription("Retrieves the content of a specified notebook.")
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
        console.log(`Fetching notebook: ${notebookName} with key: ${notebookKey}`);
        if (!notebookName) {
            return interaction.reply("Please specify a notebook name.");
        }

        const response = await fetch(`${config.SECURINOTE_API_URL}/notebooks/${notebookName}`);
        if (!response.ok) {
            return interaction.reply(`Failed to retrieve notebook: ${response.statusText}`);
        }
        const notebookData = await response.json() as INotebook;
        console.log(`Received notebook data: ${JSON.stringify(notebookData.notebook.content)}`);
        // decrypt the content if necessary (assuming it's encrypted and the key is used for decryption)
        const decryptedContent = await decrypt(notebookData.notebook.content, notebookKey);
        notebookData.notebook.content = decryptedContent;

        const contentLines = notebookData.notebook.content.split("\n");
        if (contentLines.length > 10) {
            return interaction.reply("Notebook content is too long to display.");
        }
        
        await interaction.reply(`Content of notebook "${notebookName}":\n${notebookData.notebook.content}`);

        // TODO: Modal might be applicable for longer content, but Discord has a 4000 character limit for modal input fields, so it won't work for all notebooks. 
        // Consider implementing pagination or a different approach for longer content.
        // Show a modal with the notebook content
        // const title = `Notebook: ${notebookName}`.slice(0, 45);
        // const content = notebookData.notebook.content || "(empty)";
        // interaction.showModal({
        //     title,
        //     customId: `notebook_${notebookName}`,
        //     components: [
        //         {
        //             type: 1, // Action Row
        //             components: [
        //                 {
        //                     type: 4, // Text Input
        //                     customId: "notebookContent",
        //                     label: "Content",
        //                     style: 2, // Paragraph
        //                     value: content,
        //                     required: false,
        //                 }
        //             ]
        //         },
        //     ],
        // });
        
        // contentLines.forEach(line => interaction.reply(JSON.stringify(line, null, 2)));

    }
}

export default new GetNotebookCommand();