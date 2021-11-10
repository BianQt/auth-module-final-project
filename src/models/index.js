"use strict";

const Collection = require("./lib/collection-class.model");
const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};
const DATABASE_URL =process.env.NODE_ENV === "test" ? "sqlite:memory:" : process.env.DATABASE_URL;
console.log(DATABASE_URL);
const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const  users  = require("./users");
const usersModel = users(sequelize, DataTypes);
const taskSchema = require("./task.model");
const taskModel = taskSchema(sequelize, DataTypes);

usersModel.hasMany(taskModel, { foreignKey: "userId", sourceKey: "id" });
taskModel.belongsTo(usersModel, { foreignKey: "userId", targetKey: "id" });

const Task = new Collection(taskModel);
const Users = new Collection(usersModel);

module.exports = {
  db: sequelize,
  Task: Task,
  users: usersModel,
  usersModel: Users,
};
