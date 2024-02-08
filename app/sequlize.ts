import { Sequelize } from 'sequelize';

// Initialize Sequelize with database credentials
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


// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Test the database connection when this file is executed
testConnection();

export { sequelize };