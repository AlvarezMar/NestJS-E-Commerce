import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.development.env' });

const config = {
  type: 'postgres',
  host: 'localhost',
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  dropSchema: false,
};

export default registerAs('typeorm', () => config); //*registerAs recibe el nombre de la configuración y un callback a la configuración.
export const connectionSource = new DataSource(config as DataSourceOptions);
