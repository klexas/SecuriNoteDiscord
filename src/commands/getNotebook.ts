import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { ICommand } from "../models/ICommand";
import { config } from "../config";
import type { INotebook } from "../models/INotebook";
import { decrypt } from "../utils/encryption";
import { UserServices } from "../utils/userServices";

class GetNotebookCommand implements ICommand {
    public command = new SlashCommandBuilder()
        .setName("getnotebook")
        .setDescription("Retrieves the content of a specified notebook.")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("The name of the notebook to retrieve")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("key")
                .setDescription("The key of the notebook to retrieve")
                .setRequired(false)
        )

    public async execute(interaction: ChatInputCommandInteraction) {
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
        const chunks = this.splitContent(decryptedContent, 1900);

        await interaction.reply(`**Notebook: ${notebookName}** (${chunks.length} part${chunks.length > 1 ? "s" : ""})\n\n${chunks[0]}`);

        // Send remaining chunks as follow-up messages
        for (let i = 1; i < chunks.length; i++) {
            await interaction.followUp(`**Part ${i + 1}/${chunks.length}**\n\n${chunks[i]}`);
        }
    }

    private splitContent(content: string, maxLength: number): string[] {
        const chunks: string[] = [];
        const lines = content.split("\n");
        let currentChunk = "";

        for (const line of lines) {
            // If a single line exceeds maxLength, force-split it
            if (line.length > maxLength) {
                if (currentChunk) {
                    chunks.push(currentChunk);
                    currentChunk = "";
                }
                for (let i = 0; i < line.length; i += maxLength) {
                    chunks.push(line.slice(i, i + maxLength));
                }
                continue;
            }

            if ((currentChunk + "\n" + line).length > maxLength) {
                chunks.push(currentChunk);
                currentChunk = line;
            } else {
                currentChunk = currentChunk ? currentChunk + "\n" + line : line;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    }
}

export default new GetNotebookCommand();