const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a Task(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Task = db.define('task', {
    name: {
        type: Sequelize.STRING
    },
    timestamp: {
        type: Sequelize.BIGINT,
        allowNull: false 
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
    priority: {
        type: Sequelize.STRING
    },
    createdBy: {
        type: Sequelize.STRING
    }
});

Task.associate = (models) => {
    Task.belongsTo(models.User, {
        foreignKey:'userId'
    })
}
module.exports = Task;