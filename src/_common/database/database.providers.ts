import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { config } from './database.config';
import { ConfigService } from '@nestjs/config';
import * as cls from 'cls-hooked';
const namespace = cls.createNamespace('seqlize-namespace');
export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    Sequelize.useCLS(namespace);
    const sequelize = new Sequelize(<SequelizeOptions>config(configService));
    // To drop all tables and create new ones (for test)
    // Have to use migration to add new fields if force was false
    await sequelize.sync({ force: configService.get('NODE_ENV') === 'test' });

    return sequelize;
  },
  inject: [ConfigService]
};
