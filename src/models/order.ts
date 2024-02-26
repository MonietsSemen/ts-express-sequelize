import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import User from '@/models/user';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare readonly id: CreationOptional<number>;

  declare userId: ForeignKey<User['id']>;

  declare price: number;

  declare quantityPositions: number;

  declare readonly createdAt: CreationOptional<Date>;

  declare readonly updatedAt: CreationOptional<Date>;
}

export const init = (sequelize: Sequelize) =>
  Order.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: DataTypes.INTEGER,
      quantityPositions: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'orders',
    },
  );

// eslint-disable-next-line no-shadow
export const associate = ({ models }: Sequelize) => {
  Order.belongsTo(User, {
    as: 'user',
    constraints: false,
    foreignKey: 'userId',
  });
};
export default Order;
