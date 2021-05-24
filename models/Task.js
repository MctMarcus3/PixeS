const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a Task(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Task = db.define('task', {
    title: {
        type: Sequelize.STRING
    },
    timestamp: {
        type: Sequelize.BIGINT
    },
    timeEdited: {
        type: Sequelize.BIGINT
    },
    description: {
        type: Sequelize.STRING
    },
    dateDue: { 
        type: Sequelize.DATE
    },
    assigned:{
        type: Sequelize.STRING
    },
});
module.exports = Task;