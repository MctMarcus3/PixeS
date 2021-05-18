const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Chat = db.define('chat', {
    userid: {
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING
    },
    time_sent: {
        type: Sequelize.DATE
    }
});

module.exports = Chat;