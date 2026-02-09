# securinotediscord

SecuriNoteDiscord is a small Discord bot that integrates with securinote.com to fetch and search encrypted notebooks. It provides a set of slash commands so Discord users can retrieve and search notebook content and configure per-user notebook defaults.

# READ BEFORE
***This discord bot is intended for convenience and not security, any data that the bot posts to your discord server/guild will be sent to discord servers in an unencrypted manor as a standard message. 
Be aware that discord stores messages on their servers negating the main feature of Securinote.com and therefore this bot may not be the best option for you.***

### Key features
- Fetch and decrypt notebooks from the Securinote API (client-side decryption using a user-provided key).
- Search notebook contents and return matched results directly in Discord.
- Allow users to set default notebook options (ID and key) to simplify repeated use.

### Quick start
1. Install dependencies:

```bash
bun install
```

2. Run the bot:

```bash
bun run index.ts
```

### Using the bot

The bot provides the following slash commands in Discord:

**`/ping`**
- Simple test command to check if the bot is responsive
- Returns "I'm here!" to confirm the bot is working

**`/setnotebooksettings <name> <key>`**
- Sets default notebook settings for your user
- Required parameters:
  - `name`: The ID/name of your Securinote notebook
  - `key`: Your notebook's decryption key
- Example: `/setnotebooksettings my-notebook-id my-secret-key`
- Note: Settings are stored in server memory and will be lost when the bot restarts

**`/clearsettings`**
- Clears your default notebook settings
- No parameters required
- Example: `/clearsettings`
- Removes any previously saved default notebook ID and key for your user

**`/addtonotebook <content> [name] [key]`**
- Adds new content to an existing notebook
- Required parameter:
  - `content`: Text content to append to the notebook
- Optional parameters (if not provided, uses your default settings):
  - `name`: Notebook ID to add content to
  - `key`: Decryption key for the notebook
- Example: `/addtonotebook "New note entry"` (uses defaults) or `/addtonotebook "New entry" my-notebook my-key`
- Content is appended to the end of the notebook with a newline separator

**`/getnotebook [name] [key]`**
- Retrieves and displays the full content of a notebook
- Optional parameters (if not provided, uses your default settings):
  - `name`: Notebook ID to retrieve
  - `key`: Decryption key for the notebook
- Example: `/getnotebook` (uses defaults) or `/getnotebook specific-notebook specific-key`
- Large notebooks are split into multiple messages

**`/searchnotebook <search> [name] [key]`**
- Searches for specific content within a notebook
- Required parameter:
  - `search`: Text to search for in the notebook content
- Optional parameters (if not provided, uses your default settings):
  - `name`: Notebook ID to search in
  - `key`: Decryption key for the notebook
- Example: `/searchnotebook "password" my-notebook my-key`
- Returns all lines containing the search term

Project layout (important files)
- Entry point: `src/index.ts`
- Command registration: `src/deployCommands.ts`
- Commands: `src/commands/getNotebook.ts`, `src/commands/searchNotebook.ts`, `src/commands/setNotebookSettings.ts`, `src/commands/clearSettings.ts`, `src/commands/addToNotebook.ts`, `src/commands/ping.ts`
- Utilities: `src/utils/encryption.ts`, `src/utils/userServices.ts`
- Types/models: `src/models/INotebook.ts`, `src/models/INotebookSettings.ts`, `src/models/ICommand.ts`

### Configuration
- Core configuration values (API URL, Discord credentials) live in `src/config.ts`. Provide required credentials and API endpoints before running.

### Security and data handling notes
- Decryption: notebook contents are decrypted client-side using the key supplied by the user. The project does not transmit decrypted contents to external services beyond Discord messages where appropriate.
- **Default notebook options storage: if a user sets default notebook options via the bot (for convenience), that information is stored in memory inside the running server process. This means defaults persist only while the bot process is running and will be lost on restart. Review `src/utils/userServices.ts` to change persistence behavior before deploying to production.**

*Why this matters for securinote.com
This integration enables users to access and search their Securinote notebooks from within Discord while keeping decryption keys under user control. The bot is intended as a convenience layer for interacting with Securinote content in collaborative contexts.*