(require('dotenv')).config()

const sequelize = require('./connect');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const SALT = process.env.SALT || 10;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    type: {
        type: DataTypes.ENUM('admin', 'basic'),
        defaultValue: 'basic'

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z0-9]).{8,}$/
            // This regex checks for at least one lowercase letter, one uppercase letter, one digit, and a minimum length of 8 characters
        }
    }
},{
    paranoid: true,
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (user) => {
            user.password = bcrypt.hashSync(user.password, SALT);
        },

        beforeUpdate: (user) => {
            // check if password is being updated
            if (user.changed('password')) {
                user.password = bcrypt.hashSync(user.password, SALT);
            }
        }
    }
});

module.exports = User;