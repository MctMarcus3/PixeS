const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Friends = require('./Friends');
const Task = require('./Task');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});
User.associate = (models) => {
    User.hasMany(models.Friends)
}
module.exports = User;