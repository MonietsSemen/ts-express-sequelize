import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import Collection from '@/models/collection';

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare readonly id: CreationOptional<number>;

  declare collectionId: ForeignKey<Collection['id']>;

  declare title: string;

  declare price: number;

  declare readonly createdAt: CreationOptional<Date>;

  declare readonly updatedAt: CreationOptional<Date>;
}

// eslint-disable-next-line no-shadow
export const init = (sequelize: Sequelize) =>
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'products',
    },
  );

export const associate = ({ models }: Sequelize) => {
  Product.belongsTo(Collection, { foreignKey: 'collectionId' });
};

export default Product;
