import { Model, DataTypes, Sequelize, OrderItem } from 'sequelize';
import { iShoppingItem, iShoppingList } from '../../app/data/data';
import Item from './Item';

class ShoppingList extends Model implements iShoppingList {
  public items!: Item[];
}

export function initShoppingList(sequelize: Sequelize): void {
  ShoppingList.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'ShoppingList',
      tableName: 'shopping_lists',
      timestamps: true,
    }
  );

  ShoppingList.hasMany(Item, {
    sourceKey: 'id',
    foreignKey: 'shoppingListId',
    as: 'items',
  });
}

export default ShoppingList;
