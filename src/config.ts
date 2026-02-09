import dotenv from 'dotenv';

dotenv.config();

const { TOKEN, APPLICATION_ID, GUILD_ID } = process.env;

if (!TOKEN || !APPLICATION_ID || !GUILD_ID) {
  throw new Error('TOKEN, APPLICATION_ID, or GUILD_ID is not defined in the environment variables.');
}   

export const config = {
  DISCORD_TOKEN: TOKEN,
  DISCORD_CLIENT_ID: APPLICATION_ID,
  DISCORD_GUILD_ID: GUILD_ID,
  SECURINOTE_API_URL: "https://securinote.com/api"
};