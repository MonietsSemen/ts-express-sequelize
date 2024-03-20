import pg from 'pg';
// @ts-ignore
import { Options, Sequelize } from 'sequelize';
import * as Order from '@/models/order';
import * as User from '@/models/user';
import * as Product from '@/models/product';
import * as Collection from '@/models/collection';
import config from '@/db/config';
import env from '@/configs/env';

type AppModel = {
  init(sequelize: Sequelize): void;
  associate?(sequelize: Sequelize): void;
  registerHooks?(): void;
};

function createConnection() {
  const options = config[env.nodeEnv] as Options;
  console.log(options);
  return new Sequelize(options);
}

const sequelize = createConnection();

// return bigint in number instead of string
pg.defaults.parseInt8 = true;

const models: AppModel[] = [Collection, Product, Order, User];

models.forEach((model) => model.init(sequelize));
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize);
  }
  if (model.registerHooks) {
    model.registerHooks();
  }
});

export default sequelize;
