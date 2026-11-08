const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    define: {
      timestamps: true,
      underscored: true, 
      createdAt:"created_at"    ,
      updatedAt:"updated_at"
    }
  },
);
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // test the connection
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDB();
module.exports = sequelize;
