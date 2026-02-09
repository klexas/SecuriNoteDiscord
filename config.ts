import dotenv from 'dotenv';

dotenv.config();

const { TOKEN, APPLICATION_ID } = process.env;

if (!TOKEN || !APPLICATION_ID) {
  throw new Error('TOKEN or APPLICATION_ID is not defined in the environment variables.');
}   

export default {
  TOKEN,
  APPLICATION_ID,
};