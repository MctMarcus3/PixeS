const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Note = db.define('note', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey:true
    },
    text: {
        type: Sequelize.STRING
    }, 
    x: {
        type: Sequelize.INTEGER
    },
    y: {
        type: Sequelize.INTEGER
    },
    g_id: {
        type: Sequelize.INTEGER
    },
    color:{
        type: Sequelize.STRING
    }
});

module.exports = Note;