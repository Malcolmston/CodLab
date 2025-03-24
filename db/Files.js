(require('dotenv')).config()

const sequelize = require('./connect');
const { DataTypes } = require('sequelize');

const File = sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file: DataTypes.BLOB("long")
}, {
    paranoid: true,
    sequelize,
    modelName: 'File'
})

module.exports = File;