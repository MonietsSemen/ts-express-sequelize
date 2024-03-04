import {
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import bcrypt from 'bcrypt';
import Order from '@/models/order';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare readonly id: CreationOptional<number>;

  declare name: string;

  declare email: string;

  declare password: string;

  declare role: CreationOptional<string>;

  declare description: string | null;

  declare lastName?: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare createOrder: HasManyCreateAssociationMixin<Order, 'userId'>;

  declare getOrders: HasManyGetAssociationsMixin<Order>;

  async verifyPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'staff',
      },
      description: DataTypes.STRING,
      lastName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      hooks: {
        beforeSave: async (user: User) => {
          if (user.changed('password')) {
            const saltRounds = 16;
            const password = await bcrypt.hash(user.password, saltRounds);
            user.set('password', password);
          }
        },
      },
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
