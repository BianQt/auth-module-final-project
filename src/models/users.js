"use strict";
const bcrypt = require("bcrypt");
const SECRET = process.env.SECRET || "somthing";
const jwt = require("jsonwebtoken");

const users = (Sequelize, DataTypes) => {
  const usersModel = Sequelize.define("user", {
    username: { type: DataTypes.STRING, allowNull: false, required: true },
    password: { type: DataTypes.STRING, allowNull: false, required: true },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ["read"],
          admin: ["read", "create", "update", "delete"],
        };
        return acl[this.role];
      },
    },
  });

  usersModel.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  usersModel.basicAuth = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };
  usersModel.authToken = async function (token) {

    try {
      const paresdToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: paresdToken.username } });
      if (user) {
        return user;
      }
      throw new Error("User not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };
  return usersModel;
};
module.exports = users;

