'use strict';

const taskSchema = (sequelize,DataTypes) =>
    sequelize.define('tasks',{
        taskname: {
            type: DataTypes.STRING,
            allowNull:false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

module.exports = taskSchema;