'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "unique_email",
          msg: "email must be unique",
        },
        validate: {
          isEmail: true,
        },
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false,
      }}, {
    sequelize,
    modelName: 'Student',
        tableName: 'students',
        timestamps: true,
        underscored: true,
      });
  return Student;
};