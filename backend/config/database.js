import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/ecommerce.db',
  logging: false
});

export default sequelize;