import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  DataTypes,
  CreationOptional,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import Product from '@/models/product';

class Collection extends Model<InferAttributes<Collection>, InferCreationAttributes<Collection>> {
  declare readonly id: CreationOptional<number>;

  declare title: string;

  declare description?: string | null;

  declare readonly createdAt: CreationOptional<Date>;

  declare readonly updatedAt: CreationOptional<Date>;

  declare createProduct: HasManyCreateAssociationMixin<Product, 'collectionId'>;
}

export const init = (sequelize: Sequelize) =>
  Collection.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      description: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'Collections',
    },
  );

// eslint-disable-next-line no-shadow
export const associate = ({ models }: Sequelize) => {
  Collection.hasMany(Product, {
    as: 'products',
    constraints: false,
    foreignKey: 'collectionId',
  });
};

export default Collection;
