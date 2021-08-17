const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Friends = db.define('friends', {
    friend: {
        type: Sequelize.INTEGER
    },
    friendsWith: {
        type: Sequelize.INTEGER

    },
    status: {
        type: Sequelize.ENUM(['0', '1', '2'])
    },
})

Friends.associate = function(models) {
    Friends.hasMany(Users, { foreignKey: 'id', sourceKey: 'id' });
}

module.exports = Friends;