import express from 'express';
import { Sequelize } from 'sequelize';
import { initUser } from './models/User';
import { initItem } from './models/Item';
import { initShoppingList } from './models/ShoppingList';
import { iShoppingList } from '../app/data/data';
import ShoppingList  from './models/ShoppingList';
import Item from './models/Item'; // Asegúrate de tener la ruta correcta
import { bobNexusShoppingList, arnoldBumsteadShoppingList } from '../app/data/data';


console.log('Starting application');

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  // Uncomment if you don't want to see the executed SQL requests in the logs
  // logging: false,
});

// Uncomment this if you want to create the User table
// initUser(sequelize);

// Initialize Item and ShoppingList tables
initItem(sequelize);
initShoppingList(sequelize);

const sequelizeReady = sequelize.sync({ alter: true });

const app = express();

// Middleware to parse JSON in request body
app.use(express.json());

// GET endpoint>  Validacion para evaluar si el endpoint esta corriendo adecuadamente
app.get('/testdos', (req, res) => {
  const param = req.query.param as string; // Obtener el valor del parámetro 'param'
  res.send(`Received parameter: ${param}`);
});

//Get de testeo.  Default , retorna un hello world  por medio de un select
app.get('/test', async (req, res) => {
  await sequelizeReady
  const [results] = await sequelize.query(`SELECT 'Hello World!' AS "data";`)
  res.send(results)
})

// GET endpoint para devolver un mensaje "Hello World!"
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// GET endpoint to return the first element of each shopping list
app.get('/firstItems', async (req, res) => {
  await sequelizeReady;

  try {
    const bobNexusShoppingList: iShoppingList | null = await ShoppingList.findOne({
      include: [{ model: Item, as: 'items' }],
    });


    const firstItemBobNexus = bobNexusShoppingList?.items[0];
    const firstItemArnoldBumstead = arnoldBumsteadShoppingList?.items[0];

    res.json({
      firstItemBobNexus,
      firstItemArnoldBumstead,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// POST endpoint to insert initial shopping lists from data.ts into the database
//  Parte 2 =  Popula la base de datos inicial
app.post('/insertFirstPopulate', async (req, res) => {
  await sequelizeReady;

  try {
    // Create the first shopping list
    const firstShoppingList = await ShoppingList.create();

    // Populate the items for the first shopping list
    await Promise.all(
      bobNexusShoppingList.items.map(async (shoppingItem) => {
        await Item.create({
          name: shoppingItem.name,
          unit: shoppingItem.unit,
          quantity: shoppingItem.quantity,
        });
      })
    );

    // Create the second shopping list
    const secondShoppingList = await ShoppingList.create();

    // Populate the items for the second shopping list
    await Promise.all(
      arnoldBumsteadShoppingList.items.map(async (shoppingItem) => {
        await Item.create({
          name: shoppingItem.name,
          unit: shoppingItem.unit,
          quantity: shoppingItem.quantity,
        });
      })
    );

    console.log('Initial shopping lists inserted successfully.');
    res.status(201).send('Initial shopping lists inserted successfully.');
  } catch (error) {
    console.error('Error inserting initial shopping lists:', error);
    res.status(500).send('Internal Server Error');
  }
});



//PUT  para multiplicar por dos. 
//Parte 4
app.put('/multiplyByTwo', async (req, res) => {
  await sequelizeReady
  const [results] = await sequelize.query(`update items set  quantity=quantity*2 ;`)
  res.send(results)
})


//Get para obtencion de los items almacenados
//Parte 5
app.get('/getList', async (req, res) => {
  await sequelizeReady
  const [results] = await sequelize.query(`select * from items;`)
  res.send(results)
})


//Obtener todas las listas de compras.
app.get('/shoppingLists', async (req, res) => {
  await sequelizeReady;
  const [results] = await sequelize.query('SELECT * FROM shopping_lists');
  res.json(results);
});


//Obtener listas de compras por su IDENTITY
app.get('/shoppingList/:id', async (req, res) => {
  await sequelizeReady;
  const { id } = req.params;
  const [results] = await sequelize.query(`SELECT * FROM shopping_lists WHERE id = ${id}`);
  res.json(results);
});

//listado de firstItems
app.get('/items', async (req, res) => {
  await sequelizeReady;
  const [results] = await sequelize.query('SELECT * FROM items');
  res.json(results);
});



//Obtener un item por su ID
//Example>  Get /item/9
app.get('/item/:id', async (req, res) => {
  await sequelizeReady;
  const { id } = req.params;
  const [results] = await sequelize.query(`SELECT * FROM items WHERE id = ${id}`);
  res.json(results);
});





const port = 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const shutdown = async () => {
  server.close();
  await sequelize.close();
};

process.once('SIGTERM', async function () {
  console.log('Stopping application');
  await shutdown();
  process.exit();
});
