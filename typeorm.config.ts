import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, 'data', 'database.sqlite'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  synchronize: false,
});