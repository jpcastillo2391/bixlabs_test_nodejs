// models/index.ts
import initShoppingListFunction from './ShoppingList';
import ShoppingListModel from './ShoppingList';
import initItemFunction from './Item';
import ItemModel from './Item';

export { initShoppingListFunction as initShoppingList, ShoppingListModel as ShoppingList, initItemFunction as initItem, ItemModel as Item };
