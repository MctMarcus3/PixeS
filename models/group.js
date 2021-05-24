const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Group = db.define('group', {
    name: {
        type: Sequelize.STRING
    },
    grp_id: {
        type: Sequelize.STRING
    }
});

module.exports = Group;const Sequelize = require("sequelize");
const db = require("../config/DBConfig");
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Group = db.define("group", {
  name: {
    type: Sequelize.STRING,
  },
  grp_id: {
    type: Sequelize.STRING,
  },
});

module.exports = Group;