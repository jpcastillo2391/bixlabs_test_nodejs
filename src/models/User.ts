import { DataTypes, Model, Sequelize } from 'sequelize';

import { DataType, ForeignKey, BelongsTo } from 'sequelize';
import { ShoppingItem,ShoppingList } from '../../app/data/data';

export default class User extends Model {}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    { sequelize }
  )
}