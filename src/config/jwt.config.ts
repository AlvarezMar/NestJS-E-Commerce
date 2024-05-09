import { config as configDotenv } from 'dotenv';

configDotenv({ path: '.development.env' });

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
};
