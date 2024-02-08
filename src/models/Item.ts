import { DataTypes, Model,Sequelize } from 'sequelize';
import { iShoppingItem } from '../../app/data/data'; // Asegúrate de tener la ruta correcta

class Item extends Model implements iShoppingItem {
  public name!: string;
  public unit?: string | null;
  public quantity!: number;
  public price?: number | 0.0;
}


export function initItem(sequelize: Sequelize): void {
  Item.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT, // Cambiado a FLOAT para manejar números decimales (precios)
        defaultValue: 0.0, // Valor predeterminado de 0.0 para 'price'
      },
    },
    {
      sequelize, // Asegúrate de que estás pasando la instancia de Sequelize
      modelName: 'Item',
      tableName: 'items',
      timestamps: true,
    }
  );
}

export default Item;