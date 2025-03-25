const File = require('./Files');
const User = require('./User');
const Project = require('./Project');
const Role = require('./UserFile');
const sequelize = require('./connect');

// Sync all models with the database
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = {
    File,
    User,
    Project,
    Role,
    sequelize
};