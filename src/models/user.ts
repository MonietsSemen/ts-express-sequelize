import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
  CreationOptional,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import Order from '@/models/order';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare readonly id: CreationOptional<number>;

  declare name: string;

  declare email: string;

  declare password: string;

  declare role: CreationOptional<string>;

  declare description: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare createOrder: HasManyCreateAssociationMixin<Order, 'userId'>;

  declare getOrders: HasManyGetAssociationsMixin<Order>;
}

export const init = (sequelize: Sequelize) =>
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'staff',
      },
      description: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    },
  );

export const associate = ({ models }: Sequelize) => {
  User.hasMany(Order, {
    as: 'orders',
    constraints: false,
    foreignKey: 'userId',
  });
};

export default User;
